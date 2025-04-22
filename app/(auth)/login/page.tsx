"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import Image from "next/image";

function Login() {
  return (
    <div className=" w-full h-screen flex justify-center items-center">
      <Card className="w-[450px] h-[300px] bg-purple-400">
        <CardHeader className="flex items-center mb-6">
          <CardTitle className="font-bold text-3xl m-auto">Login</CardTitle>
        </CardHeader>

        <CardFooter className="flex justify-center mt-4 flex-col gap-4 ">
          <Button
            className="font-semibold text-2xl px-6 py-5 bg-white text-black hover:bg-purple-300 hover:text-white"
            onClick={() => signIn("google", { callbackUrl: "/room/join" })}
          >
            <p>sign in with google</p>
            <Image src="/google.png" width={20} height={20}  alt="google icon"/>
          </Button>
          <Button
            className="font-semibold text-2xl px-6 py-5 bg-white text-black hover:bg-purple-300 hover:text-white"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          >
            <p>sign in with Github</p>
            <Image src="/github.png" width={25} height={20}  alt="github icon"/>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
