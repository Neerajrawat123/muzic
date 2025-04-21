import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";
const CreateRoomSchema = z.object({
  room: z.string(),
  code: z.string(),
});
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();
    const session = await getServerSession(authOptions);

    const roomData = CreateRoomSchema.parse(data);

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

    const r = await prisma.space.create({
      data: {
        name: roomData.room,
        code: roomData.code,
        hostId: session?.user.id,
      },
    });

    return NextResponse.json({
        message: 'room created successfully'
    },{
        status: 200
    })
  } catch (error) {
    console.log(error);
  }
}
