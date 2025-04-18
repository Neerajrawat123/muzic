'use client'

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {  Label } from "@/components/ui/label"
import { login, signup } from "@/app/actions/authenticate"
import { signIn } from "next-auth/react"


function Login() {
 
  

  return (
    <div className=" w-full h-screen flex justify-center items-center">
    
    <Card className="w-[450px] h-[400px]">
      <CardHeader className="flex items-center mb-6">
        <CardTitle className="font-bold text-3xl m-auto">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form  id="login_form">
          <div className="grid w-full items-center gap-4">
            <div className="flex text-[19px] flex-col space-y-1.5">
              <Label className="text-[19px]" htmlFor="email">Email</Label>
              <Input className="text-[19px] font-medium" type="email" name="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label className="text-[19px]" htmlFor="framework">Password</Label>
              <Input className="text-[19px]  font-medium" type="password" name="password" id="password" placeholder="Enter your password" />

            </div>
          </div>
        </form>
      </CardContent >
      <CardFooter className="flex justify-center mt-4">
        <Button className="font-semibold text-2xl px-6 py-5" type="submit" form="login_form">Submit</Button>
        <Button className="font-semibold text-2xl px-6 py-5" onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>sign in with google</Button>
        <Button className="font-semibold text-2xl px-6 py-5" onClick={() => signIn("github", { callbackUrl: "/dashboard" })}>sign in with github</Button>

      </CardFooter>
    </Card>
    
</div>


  )
}


export default Login
