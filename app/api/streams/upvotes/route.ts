import {prisma} from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth.config";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
   try {
 
     const searchParams = req.nextUrl.searchParams;
     const query: string | null = searchParams.get('id')
     const session = await getServerSession(authOptions)
 
     const userId = session?.user.id
     console.log('upvote',query, userId)


     if(!query){
        return NextResponse.json({
            message: 'stream id is mandatory'
        })
     }
 
     
 
     if(!userId){
         return NextResponse.json({
             message: 'error to find user'
         })
     }
 
 
     await prisma.upvotes.create({
         data: {
             streamId: query ,
             userId
         }
     })
 
 
     return NextResponse.json({
         message: 'upvote successful'
     },{
        status: 200
     })
   } catch (error) {
    console.log(error)

    return NextResponse.json({
        message: 'error in upvoting'
    }, {
        status: 303
    })


    
   }

    
}