import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";



export async function DELETE(req: NextRequest, res: NextResponse) {
  const streamId = req.nextUrl.searchParams.get("id");
  const session = await getServerSession(authOptions);

  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ message: "unauthenticated" }, { status: 401 });
  }

  try {
    if (!streamId) {
      return NextResponse.json(
        { message: "stream id is required" },
        { status: 404 }
      );
    }

    const currentStream = await prisma.currentStream.delete({
      where: {
        streamId: streamId,
      },
    });

    await prisma.stream.delete({
      where: {
        userid: userId,
        id: streamId,
      },
    });




    return NextResponse.json(
      { message: "song removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "error in removing stream" },
      { status: 404 }
    );
  }
}
