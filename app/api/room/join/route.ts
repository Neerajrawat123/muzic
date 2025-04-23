import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// @ts-ignore
import { z } from "zod";

const JoinRoomSchema = z.object({
  roomCode: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const session = await getServerSession(authOptions);

    const roomData = JoinRoomSchema.parse(data);


    if(!session?.user?.id){
        return NextResponse.json({
            message: 'unauthorized'
        },{
            status: 401
        })
    }

    if (!roomData) {
      return NextResponse.json(
        {
          message: "please enter the room",
        },
        {
          status: 303,
        }
      );
    }

    const room = await prisma.space.findFirst({
      where: {
        code: roomData.roomCode,
      },
    });

    if (!room) {
      return NextResponse.json(
        {
          message: "no room found",
        },
        {
          status: 500,
        }
      );
    }


    const member = await prisma.spaceMember.findFirst({
        where: {
            userId: session?.user.id,
            spaceId: room.id
        }
    })

    if (room.hostId !== session?.user.id && !member){
         await prisma.spaceMember.create({
            data: {
              userId: session?.user.id,
              spaceId: room.id,
            },
          });
      
    }

    

    return NextResponse.json(
      {
        message: "room joined successfully",
        room: JSON.stringify(room),
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
  }
}
