import { GradientBackground } from "@/components/gradiant-background";
import { Button } from "@/components/ui/button";
import { Music, ThumbsUp, List } from "lucide-react"
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions)
  console.log(session)

  return (
    

<div className="flex min-h-screen flex-col">
<GradientBackground />

{/* Navigation */}
<header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
  <div className="container flex h-16 items-center justify-between px-4 md:px-6">
    <div className="flex items-center gap-2">
      <Music className="h-6 w-6 text-puhref={session?.user ? '/dashboard' : '/login'}rple-400" />
      <span className="text-xl font-bold text-white">MusicRoom</span>
    </div>
    <nav className="flex gap-4 items-center">
      <Link href={session?.user ? '/dashboard' : '/login'} className="font-semibold  text-white/80 hover:text-white hover:underline">
        Dashboard
      </Link>
      <Button asChild className="bg-purple-600 hover:bg-purple-700">
        <Link href={session?.user ? '/dashboard' : '/login'}>Get Started</Link>
      </Button>
    </nav>
  </div>
</header>

{/* Hero Section */}
<section className="w-full py-12 md:py-24 lg:py-32">
  <div className="container px-4 md:px-6">
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
      <div className="flex flex-col justify-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl xl:text-6xl/none">
            Share Music Together
          </h1>
          <p className="max-w-[600px] text-white/70 md:text-xl/relaxed">
            Create a room, play songs, and let your friends vote on what plays next. The perfect way to discover
            new music together.
          </p>
        </div>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href={session?.user ? '/dashboard' : '/login'}>Create a Room</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className=" text-purple-600 hover:border-black border-black hover:text-purple-600"
          >
            <Link href={session?.user ? '/dashboard' : '/login'}>Join a Room</Link>
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
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
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

{/* Features Section */}
<section className="w-full bg-black/30 py-12 backdrop-blur-md md:py-24 lg:py-32">
  <div className="container px-4 md:px-6">
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">How It Works</h2>
        <p className="max-w-[900px] text-white/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          A simple way to share and discover music with friends and strangers alike.
        </p>
      </div>
    </div>
    <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
      <div className="flex flex-col items-center space-y-4 rounded-lg border border-purple-800/30 bg-black/20 p-6 backdrop-blur-md">
        <div className="rounded-full bg-purple-900/50 p-4">
          <Music className="h-6 w-6 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Create a Room</h3>
        <p className="text-center text-white/70">
          Start your own music room and invite friends to join with a simple link.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-4 rounded-lg border border-indigo-800/30 bg-black/20 p-6 backdrop-blur-md">
        <div className="rounded-full bg-indigo-900/50 p-4">
          <List className="h-6 w-6 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Add Songs</h3>
        <p className="text-center text-white/70">
          Add your favorite songs to the queue and let everyone enjoy your taste in music.
        </p>
      </div>
      <div className="flex flex-col items-center space-y-4 rounded-lg border border-blue-800/30 bg-black/20 p-6 backdrop-blur-md">
        <div className="rounded-full bg-blue-900/50 p-4">
          <ThumbsUp className="h-6 w-6 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Vote on Songs</h3>
        <p className="text-center text-white/70">
          Upvote or downvote songs in the queue to decide what plays next.
        </p>
      </div>
    </div>
  </div>
</section>

{/* CTA Section */}
<section className="w-full py-12 md:py-24 lg:py-32">
  <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
    <div className="space-y-2">
      <h2 className="text-3xl font-bold tracking-tighter text-white md:text-4xl/tight">
        Ready to start your musical journey?
      </h2>
      <p className="max-w-[600px] text-white/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
        Join thousands of users who are already sharing and discovering new music together.
      </p>
    </div>
    <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
      <Button size="lg" asChild className="bg-purple-600 hover:bg-purple-700">
        <Link href="/dashboard">Get Started</Link>
      </Button>
    </div>
  </div>
</section>

{/* Footer */}
<footer className="border-t border-white/10 py-6 md:py-0">
  <div className="container flex flex-col items-center justify-between gap-4 px-4 md:h-16 md:flex-row md:px-6">
    <p className="text-center text-sm text-white/50">
      © {new Date().getFullYear()} MusicRoom. All rights reserved.
    </p>
    <div className="flex gap-4">
      <Link href="#" className="text-sm text-white/50 hover:text-white hover:underline">
        Terms
      </Link>
      <Link href="#" className="text-sm text-white/50 hover:text-white hover:underline">
        Privacy
      </Link>
    </div>
  </div>
</footer>
</div>

   
  );
}


