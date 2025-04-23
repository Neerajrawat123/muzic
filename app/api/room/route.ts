import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// @ts-ignore
import { authOptions } from "@/app/api/auth/auth.config";
import { Prisma } from "@prisma/client"

export async function GET(req: NextRequest, ) {

     try {
        const session = await getServerSession(authOptions);


        if (!session?.user) {
          return NextResponse.json(
            {
              message: "Please authenticate first",
            },
            {
              status: 403,
            }
          );
        }

        if (!session?.user?.id) {
          throw new Error("User ID missing from session");
        }


        const roomCode = req.nextUrl.searchParams.get('code')
    
    
        if (!roomCode) {
          return NextResponse.json(
            {
              message: "room code is required",
            },
            {
              status: 303,
            }
          );
        }
    
        

        


          const space = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const room = await tx.space.findFirst({
                where: {
                  code: roomCode,
                },
                include: {
                  currentStream: true
                }
              });
    
          
           const members =  await tx.spaceMember.findMany({
              where: {
                spaceId: room?.id, 
              },
              include: {
                user: true
              }
            });
          
            return {room, members};
          });
        
          

        if(!space.room){
            return NextResponse.json({
                message: 'room not found',
            },{
                status: 404
            })


        }
    
        return NextResponse.json({
            message: 'room found successfully',
            room: JSON.stringify(space.room),
            members: JSON.stringify(space.members)

        },{
            status: 200
        })
      } catch (error) {
        console.log('Room api error',error);
        return NextResponse.json({
            message: 'Room api error',
        },{
            status: 500
        })
      }
    
}
