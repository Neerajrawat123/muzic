import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {  Video, YouTube } from "popyt";
import { z } from "zod";
import { authOptions } from "@/app/api/auth/auth.config";

const youtube = new YouTube(process.env.YOUTUBE_API_KEY as string);



const YOUTUBE_REGEX =
  /https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&t=(\d+)s?)?/;

const streamSchema = z.object({
  type: z.enum(["Youtube", "Spotify"]),
  userId: z.string(),
  url: z.string().url(),
  spaceId: z.string()
});

export async function POST(req: Request) {
 try {
   const body = await req.json();
 
   const streamData = streamSchema.parse(body);
   const isYoutubeURl = YOUTUBE_REGEX.test(streamData.url);
 
   // if is not youtube url
 
   if (!isYoutubeURl) {
     return NextResponse.json({
       message: "please enter the valid youtube url",
       status: 303,
     });
   }
 
   const extractedId = body.url.split("=")[1];
   if (!extractedId) {
     return NextResponse.json({
       message: "Could not extract video ID from URL",
       status: 400
     });
   }
 
 
   const video = await youtube.getVideo(extractedId);
 
 
   if (!video) {
     return NextResponse.json({
       message: "video not found",
       status: 303,
     });
   }
 
   const stream = await prisma.stream.create({
     data: {
       type: streamData.type,
       userid: streamData.userId, // existing user ID
       url: streamData.url,
       extractedId: extractedId,
       bigPic: (video as Video)?.thumbnails?.medium?.url ?? "",
       smallPic: (video as Video).thumbnails.default?.url ?? "",
       title: (video as Video).title,
       creator: (video as Video).channel.name,
       spaceId: streamData.spaceId
     },
   });
 
   return NextResponse.json(
     {
       message: "stream is succesfully added",
       stream: JSON.stringify(stream),
     },
     {
       status: 201,
     }
   );
 } catch (error) {
    console.log('Stream api error',error);
    return NextResponse.json({
        message: 'Stream api error',
    },{
        status: 500
    })  
  
 }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const searchParams = req.nextUrl.searchParams;
  const spaceId = searchParams.get('spaceId');

  if (!session?.user) {
    return NextResponse.json(
      {
        message: "pls authenticate first",
      },
      {
        status: 403,
      }
    );
  }

  if (!session?.user?.id) {
    throw new Error("User ID missing from session");
  }

  if (!spaceId) {
    return NextResponse.json(
      {
        message: "spaceId is required",
      },
      {
        status: 400,
      }
    );
  }
  

  const streams = await prisma.stream.findMany({
    where: {
      spaceId: spaceId,
    },
    include: {
      _count: {
        select: {
          upvotes: true,
        },
      },
      upvotes: {
        where: {
          userId: session.user.id,
        },
      },
    },
  });


  if(streams.length === 0){
    return NextResponse.json({
      message: "no streams found",
    },{
      status: 202
    })
  }


  const space = await prisma.space.findFirst({
    where: {
      id: spaceId,
    },
    include: {
      currentStream: true
    }
  });
  console.log(space)


  if(!space?.currentStream){
    await prisma.currentStream.create({
      data: {
        spaceId: spaceId,
        streamId: streams[0].id,
        userId: streams[0].userid
      },
    });
  }


  const currentStream = await prisma.currentStream.findFirst({
    where: {
      spaceId: spaceId,
    },
  });
  
  



  return NextResponse.json(
    {
      message: "streams fetched successfully",
      streams: JSON.stringify(streams),
      currentStream: JSON.stringify(currentStream)
    },
    {status: 200}
  );
}
