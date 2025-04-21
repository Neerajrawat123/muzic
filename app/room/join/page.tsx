'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ResponseType } from '@/types/ws'
import socket from '@/utils/socket'
import { Label } from '@radix-ui/react-label'
import { useRouter } from 'next/navigation'
import React, { FormEvent, useContext, useEffect, useState } from 'react'

function Join() {

  const [inp, setInp] = useState('')


  const roomContext = useContext(RoomContext);
  const router = useRouter();

  if (!roomContext) {
    throw new Error("RoomContext must be used within a RoomProvider");
  }

  const { room } = roomContext;

  useEffect(() => {
    if (!socket) {
      console.error("socket is not connected");
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      console.log("✅ Connected:", socket.id);
    };
  
    socket.on("connect", handleConnect);
  
    return () => {
      socket.off("connect", handleConnect); // cleanup
    };





  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!socket || !socket.connected) {
      console.error("Socket not connected");
      return;
    }

    socket?.emit(
      "join_room",
      inp,
      (response: ResponseType) => {
        console.log(response)
        if (response?.status === "ok") {
          console.log("heloo", response.room);
          console.log(room);
          router.push("/dashboard");
        }else{
          console.log('enter code is wrong')
        }
      }
    );
  }


  return (
    <div className=" w-full h-screen flex justify-center items-center bg-gray-200">
    <Card className="w-[450px] h-[300px] ">
      <CardHeader className="flex items-center mb-6">
        <CardTitle className="font-bold text-3xl m-auto"> Join the Room</CardTitle>
      </CardHeader>
      <CardContent>
      <form id='Create_room' onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label className='mb-4' htmlFor="name">room code</Label>
            <Input value={inp} onChange={(e) => setInp(e.target.value)} id="name" placeholder="Enter the no" />
          </div>
          
        </div>
      </form>
      </CardContent>
      <CardFooter>
          <Button type='submit' form='Create_room' >join the room</Button>
      </CardFooter>

     
    </Card>
  </div>
  )
}

export default Join