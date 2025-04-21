import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Thumbnail, Video, YouTube } from "popyt";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/route";

const youtube = new YouTube("AIzaSyCGbRm2kCcHaS8G7aCPZtJjLskD2gr_J5o");

type VideoType = {
  title: string;
  channel: {
    name: string;
  };
  thumbnails: Thumbnail;
};

const YOUTUBE_REGEX =
  /https?:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(?:&t=(\d+)s?)?/;

const streamSchema = z.object({
  type: z.enum(["Youtube", "Spotify"]),
  userId: z.string(),
  url: z.string().url(),
});

export async function POST(req: Request, res: NextResponse) {
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

  const video = await youtube.getVideo(extractedId);
  console.log(video);

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
    },
  });

  return NextResponse.json(
    {
      message: "stream is succesfully added",
      stream: JSON.stringify(stream),
    },
    {
      status: 200,
    }
  );
}

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);

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
  

  let streams = await prisma.stream.findMany({
    where: {
      userid: session.user.id,
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

  return NextResponse.json(
    {
      message: "hello this is reponse",
      streams: JSON.stringify(streams),
    },
    {}
  );
}
