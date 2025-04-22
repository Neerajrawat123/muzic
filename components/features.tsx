import { Music, ThumbsUp } from 'lucide-react'
import { List } from 'lucide-react'
import React from 'react'

function features() {
  return (
    <section className="w-full bg-black/30 py-12 backdrop-blur-md md:py-24 lg:py-32">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
            How It Works
          </h2>
          <p className="max-w-[900px] text-white/70 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            A simple way to share and discover music with friends and
            strangers alike.
          </p>
        </div>
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
        <div className="flex flex-col items-center space-y-4 rounded-lg border border-purple-800/30 bg-black/20 p-6 backdrop-blur-md">
          <div className="rounded-full bg-purple-900/50 p-4">
            <Music   className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Create a Room</h3>
          <p className="text-center text-white/70">
            Start your own music room and invite friends to join with a
            simple link.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4 rounded-lg border border-indigo-800/30 bg-black/20 p-6 backdrop-blur-md">
          <div className="rounded-full bg-indigo-900/50 p-4">
            <List className="h-6 w-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Add Songs</h3>
          <p className="text-center text-white/70">
            Add your favorite songs to the queue and let everyone enjoy your
            taste in music.
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
  )
}

export default features