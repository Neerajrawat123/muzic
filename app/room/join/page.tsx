"use client";
import { RoomContext } from "@/app/providers/roomProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ResponseType } from "@/types/ws";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useContext, useEffect, useState } from "react";

function Join() {
  const [inp, setInp] = useState("");

  const roomContext = useContext(RoomContext);

  if (!roomContext) {
    throw new Error("RoomContext must be used within a RoomProvider");
  }

  const { room } = roomContext;

  const [roomCode, setRoomCode] = useState("");

  const router = useRouter();

  if (!roomContext) {
    throw new Error("RoomContext must be used within a RoomProvider");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    console.log("hello");
    e.preventDefault();

    try {
      const response = await axios.post("/api/room/join", { roomCode });
      if (response.status === 200) {
        const room = JSON.parse(response.data.room)
        router.push(`/dashboard/${room.code}`)

      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className=" w-full h-screen flex justify-center items-center bg-gray-200">
      <Card className="w-[450px] h-[360px] ">
        <CardHeader className="flex items-center mb-6">
          <CardTitle className="font-bold text-3xl m-auto">
            {" "}
            Join the Room
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form id="Create_room" onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label className="mb-4" htmlFor="name">
                  room code
                </Label>
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  id="name"
                  placeholder="Enter the no"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-between">
          <Button type="submit" form="Create_room">
            join the room
          </Button>
          <Link
            className="rounded-2xl   text-center text-black underline px-4 py-2 font-semibold  text-lg "
            href={"/room/create"}
          >
            Create Room
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Join;
