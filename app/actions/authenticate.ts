'use server'


let data: Info[] = []

interface Info {
    name: string,
    email: string,
    password: string
}

import { FormState, LoginFormState, singupFormSchema } from "@/lib/definitions";
import prisma from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function signup(state: FormState ,formData: FormData) {
   
    const validateFields = singupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    })


    if(!validateFields.success){
         return {
            errors: validateFields.error.flatten().fieldErrors
         }
    }


    

    const { name, email, password} = validateFields.data;

    const users = await prisma.user.findMany()
    console.log(users)


    const IsUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    })


    if(IsUserExist){
        return NextResponse.json({
            message: 'user is already exist',
            
        },{
            status: 300
        })
    }


    

    let user = await prisma.user.create({
        data: {
            name, email, password
        }
    })




    

return NextResponse.json(
  {
    message: 'User created successfully',
    userData: {name: user.name, email: user.email , id: user.id}
  },
  {
    status: 200,
  }
);


   






    redirect('/profile')

   

}



export async function login(state: LoginFormState, formData: FormData) {
    const validateFields = singupFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
    })


    if(!validateFields.success){
         return {
            errors: validateFields.error.flatten().fieldErrors
         }
    }


    const { name, email, } = validateFields.data;

    console.log(name, email )
}