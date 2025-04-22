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
import socket from "@/utils/socket";
import { Label } from "@radix-ui/react-label";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, {
  useState,
  useEffect,
  useContext,
  FormEvent,
} from "react";

function Create() {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const roomContext = useContext(RoomContext);
  const router = useRouter();

  if (!roomContext) {
    throw new Error("RoomContext must be used within a RoomProvider");
  }

  



  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    console.log('hello')
    e.preventDefault();

    try {
      const response = await axios.post('/api/room/create', {roomCode, roomName})
      if(response.status === 200){
      const room = JSON.parse(response.data.room)
        router.push(`/dashboard/${room.code}`)
      }
    } catch (error) {
      
      console.log(error)
    }

    
  }
  return (
    <div className=" w-full h-screen flex justify-center items-center">
      <Card className="w-[450px] h-[370px] ">
        <CardHeader className="flex items-center mb-6">
          <CardTitle className="font-bold text-3xl m-auto">
            Create the Room
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="Create_room" onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label className="mb-4" htmlFor="name">
                  Enter the room name
                </Label>
                <Input
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  id="name"
                  placeholder="Enter the name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="mb-4" htmlFor="code">
                  Enter the room code
                </Label>
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  id="code"
                  placeholder="Enter the code"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            form="Create_room"
            disabled={!roomName || !roomCode}
          >
            Create the room
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Create;
