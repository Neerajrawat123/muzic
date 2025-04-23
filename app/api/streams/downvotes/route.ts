import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/auth.config";



export async function POST(req: NextRequest) {
   try {
 
     const searchParams = req.nextUrl.searchParams;
     const query: string | null = searchParams.get('id')
     const session = await getServerSession(authOptions)
 
     const userId = session?.user?.id
 
     
 
     if(!userId){
         return NextResponse.json({
             message: 'error to find user'
         })
     }

     if(!query){
        return NextResponse.json({
            message: 'stream id is mandatory'
        })
    }
 
 
     await prisma.upvotes.delete({
        where: {
           userId_streamId: {
            userId: userId,
            streamId: query
           }
        }
     })
 
 
     return NextResponse.json({
         message: 'downvote successful'
     },{
        status: 200
     })
   } catch (error) {
    console.log(error)

    return NextResponse.json({
        message: 'error in downvot'
    }, {
        status: 303
    })


    
   }

    
}