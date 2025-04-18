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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/app/actions/authenticate";


function Signup() {

      const [state, action, pending] = React.useActionState(signup, undefined)
  
  
  return (
    <div className=" w-full h-screen flex justify-center items-center">
      <Card className="w-[450px] ">
        <CardHeader className="flex items-center mb-6">
          <CardTitle className="font-bold text-3xl m-auto">Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} id="signup_form">
            <div className="grid w-full items-center gap-4">
              <div className="flex text-[19px] flex-col space-y-1.5">
                <Label className="text-[19px]" htmlFor="name">
                  Name
                </Label>
                <Input
                  className="text-[19px] font-medium"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                />
              </div>
              {state?.errors?.name && <p>{state.errors.name}</p>}
              <div className="flex text-[19px] flex-col space-y-1.5">
                <Label className="text-[19px]" htmlFor="email">
                  Email
                </Label>
                <Input
                  className="text-[19px] font-medium"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                />
              </div>
              {state?.errors?.email && <p>{state.errors.email}</p>}
              <div className="flex flex-col space-y-1.5">
                <Label className="text-[19px]" htmlFor="password">
                  Password
                </Label>
                <Input
                  className="text-[19px]  font-medium"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                />
                {state?.errors?.password && (
                  <div className="text-red-500">
                    <p>Password must:</p>
                    <ul>
                      {state.errors.password.map((error) => (
                        <li key={error}>- {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </form>
        </CardContent>
        <CardFooter className="flex justify-center ">
          <Button className="font-semibold text-2xl px-6 py-5" type="submit" form="signup_form">Submit</Button>
        </CardFooter>
      </Card>
    </div>

    
  );
}

export default Signup;
