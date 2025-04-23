import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
const CreateRoomSchema = z.object({
    roomCode: z.string(),
    roomName: z.string(),
});
export async function POST(req: NextRequest, ) {
  try {
    const data = await req.json();
    const session = await getServerSession(authOptions);

    const roomData = CreateRoomSchema.parse(data);
    if(!session?.user?.id){
        return NextResponse.json({
            message: "unauthorized",
            status: 401
        })
    }

    if (!roomData) {
      return NextResponse.json(
        {
          message: "please enter the room and code",
        },
        {
          status: 303,
        }
      );
    }

    const space = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const createdSpace = await tx.space.create({
          data: {
            name: roomData.roomName,
            code: roomData.roomCode,
            hostId: session?.user.id,
          },
        });
      
        await tx.spaceMember.create({
          data: {
            userId: session?.user.id,
            spaceId: createdSpace.id, 
            userType: 'host'    // Now we can safely reference it
          },
        });
      
        return createdSpace;
      });
    return NextResponse.json({
        message: 'room created successfully',
        room: JSON.stringify(space)
    },{
        status: 200
    })
  } catch (error) {
    console.log(error);
  }
}
