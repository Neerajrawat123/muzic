import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextURL } from "next/dist/server/web/next-url";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";

const upvoteSchema = z.object({
    streamId: z.string(),
    userId: z.string()
})

export async function POST(req: NextRequest) {
   try {
 
     const searchParams = req.nextUrl.searchParams;
     const query: string = searchParams.get('id')
     const session = await getServerSession(authOptions)
 
     const userId = session?.user.id
     console.log('upvote',query, userId)
 
     
 
     if(!userId){
         return NextResponse.json({
             message: 'error to find user'
         })
     }
 
 
     const upvotes = await prisma.upvotes.delete({
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