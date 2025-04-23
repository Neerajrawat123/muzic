import { Music } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import Link from 'next/link';

    async function Navigation() {
    const session = await getServerSession(authOptions);
    console.log(session)

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-purple-400" />
            <span className="text-xl font-bold text-white">MusicRoom </span>
          </div>
          <nav className="flex gap-4 items-center">
            <Link
              href={session?.user ? "/room/join" : "/login"}
              className="font-semibold  text-white/80 hover:text-white hover:underline"
            >
              Dashboard
            </Link>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href={session?.user ? "/room/join" : "/login"}>
                Get Started
              </Link>
            </Button>
          </nav>
        </div>
      </header>

  )
}

export default Navigation