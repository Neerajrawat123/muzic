import { List, Music, ThumbsUp } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export default async function HeroSection() {
    const session = await getServerSession(authOptions);
    
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
    <div className="container px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
              Share Music Together
            </h1>
            <p className="max-w-[600px] text-white/70 md:text-xl/relaxed">
              Create a room, play songs, and let your friends vote on what
              plays next. The perfect way to discover new music together.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button
              size="lg"
              asChild
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Link href={session?.user ? "/room/create" : "/login"}>
                Create a Room
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className=" text-purple-600 hover:border-black border-black hover:text-purple-600"
            >
              <Link href={session?.user ? "/room/join" : "/login"}>
                Join a Room
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center cursor-pointer transition duration-1000 hover:skew-2">
          <div className="relative h-[350px] w-[350px] rounded-xl bg-gradient-to-br from-purple-500 to-indigo-700 p-6 shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <Music className="h-24 w-24 text-white opacity-20" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 rounded-lg bg-black/30 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="font-medium">Currently Playing</h3>
                  <p className="text-sm opacity-80">Song Title - Artist</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>        
  )
}

