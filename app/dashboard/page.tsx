"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Music,
  Users,
  ThumbsUp,
  ThumbsDown,
  SkipForward,
  Play,
  Pause,
  Volume2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { WaveBackground } from "@/components/wave-background";
import { useSession } from "next-auth/react";
import debounce from "lodash.debounce";
import axios from "axios";
import { mockSongs, mockUsers } from "@/utils/sampleData";

// Mock data for the dashboard

export default function Dashboard() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSong, setCurrentSong] = useState([]);
  const [queue, setQueue] = useState([]);
  const [volume, setVolume] = useState([75]);
  const [songUrl, setSongUrl] = useState("");
  const { data: session } = useSession();
  console.log(queue)

  useEffect(() => {
   getStreams()
  }, []);

  async function getStreams() {
    try {
      const response = await axios.get("/api/streams");
      const streams:[] = JSON.parse(response.data.streams);
      setCurrentSong(streams[0])
      setQueue(streams.slice(1));
    } catch (error) {
      console.error(error);
    }
  }

  const handleVote = async (id: string, isUpvote: boolean) => {
    console.log(id, isUpvote)
    
    setQueue(
      queue
        .map( (song) => {
          if (song.id === id) {
            if(!isUpvote){
              song._count.upvotes = song._count.upvotes + 1
        
            }else{
              song._count.upvotes = song._count.upvotes - 1
        
            }
          }

          return song;
        })
    );

    const voteResponse = await axios({method: 'post', url: `/api/streams/${isUpvote ? 'downvotes': 'upvotes'}?id=${id}`})
    getStreams()
  };

  const addSongToStream = async () => {
    if (!songUrl.trim()) {
      console.warn("please enter a valid url");
      return;
    }
    try {
      const response = await axios.post("api/streams", {
        type: "Youtube",
        userId: session?.user?.id,
        url: songUrl,
      });

      if (response.status === 200) {
        setSongUrl("");
      }
    } catch (error) {
      console.error("Error adding song to stream:", error);
    }
  };


    
    

  return (
    <div className="flex min-h-screen flex-col">
      <WaveBackground />

      {/* Navigation */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Music className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">MusicRoom</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-purple-500/50 text-white"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Room: Awesome Mix</span>
            </Badge>
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=32&width=32"
                alt="User"
              />
              <AvatarFallback className="text-lg cursor-pointer">
                {session?.user ? session?.user?.name?.slice(0, 1) : ""}
              </AvatarFallback>
            </Avatar>              

          </div>
        </div>
      </header>

      <div className="container grid flex-1 gap-6 px-4 py-6 md:grid-cols-[1fr_300px] md:px-6 lg:grid-cols-[1fr_350px]">
        <div className="flex flex-col gap-6">
          {/* Now Playing */}
          <Card className="overflow-hidden border-purple-500/20 bg-black/40 backdrop-blur-md">
            <div className="bg-gradient-to-r from-purple-500/80 to-indigo-700/80 p-6">
              <div className="flex flex-col items-center gap-6 md:flex-row">
                <div className="relative h-48 w-48 overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={currentSong.bigPic || "/placeholder.svg"}
                    alt={currentSong.title || 'jhe;'} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col text-white">
                  <Badge className="mb-2 w-fit bg-white/20 hover:bg-white/30">
                    Now Playing
                  </Badge>
                  <h1 className="text-3xl font-bold">{currentSong.title}</h1>
                  <p className="text-xl opacity-90">{currentSong.creator}</p>

                  <div className="mt-6 flex items-center gap-4">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>
                    <div className="flex flex-1 items-center gap-2">
                      <Volume2 className="h-5 w-5" />
                      <Slider
                        value={volume}
                        max={100}
                        step={1}
                        className="w-full"
                        onValueChange={setVolume}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-green-400" />
                  <span className="text-lg font-medium">
                    {currentSong?._count?.upvotes} votes
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={mockUsers[0].avatar || "/placeholder.svg"}
                      alt={mockUsers[0].name}
                    />
                    <AvatarFallback>{mockUsers[0].name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-white/70">
                    Added by {currentSong.username}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Song Queue */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Up Next</h2>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
                <Input
                  type="search"
                  placeholder="Search for a song..."
                  className="w-full border-purple-500/30 bg-black/30 pl-9 text-white placeholder:text-white/50 focus-visible:ring-purple-500/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="rounded-lg border border-purple-500/20 bg-black/40 shadow-sm backdrop-blur-md">
              <div className="p-4">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 font-medium text-white/70">
                  <div className="pl-12">#</div>
                  <div>Title</div>
                  <div className="pr-4">Votes</div>
                </div>
              </div>
              <Separator className="bg-purple-500/20" />
              <div className="divide-y divide-purple-500/20">
                {queue.map((song, index) => (
                  <div
                    key={song?.id}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 text-white hover:bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 text-center text-white/50">
                        {index + 1}
                      </span>
                      <div className="relative h-10 w-10 overflow-hidden rounded">
                        <Image
                          src={song?.bigPic || "/placeholder.svg"}
                          fill
                          alt={song?.title}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{song?.title}</div>
                      <div className="text-sm text-white/70">
                        {song?.creator}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 pr-2">
                        { <span className="font-medium">{song._count.upvotes}</span> }
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-green-400 hover:bg-green-500/20 hover:text-green-300"
                        onClick={() => handleVote(song.id, !!song.upvotes.length)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Room Info */}
          <Card className="border-purple-500/20 bg-black/40 backdrop-blur-md text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold">Room: Awesome Mix</h3>
              <p className="text-sm text-white/70">Created by Alex</p>
              <Separator className="my-4 bg-purple-500/20" />
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Room Code</h4>
                  <div className="flex items-center gap-2">
                    <Input
                      value="MUSIC123"
                      readOnly
                      className="border-purple-500/30 bg-black/30 text-white focus-visible:ring-purple-500/50"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-500/50  hover:bg-purple-500/20 text-black hover:text-white"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Room Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Public Room</span>
                      <Badge variant="outline" className="border-purple-500/50">
                        On
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Max Queue</span>
                      <Badge variant="outline" className="border-purple-500/50">
                        50 songs
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Vote to Skip</span>
                      <Badge variant="outline" className="border-purple-500/50">
                        5 votes
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users in Room */}
          <Card className="border-purple-500/20 bg-black/40 backdrop-blur-md text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Users in Room</h3>
                <Badge className="bg-purple-600">{mockUsers.length}</Badge>
              </div>
              <Separator className="my-4 bg-purple-500/20" />
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      />
                      <AvatarFallback className="text-black">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      {user.id === 1 && (
                        <div className="text-xs text-white/50">Room Owner</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Song */}
          <Card className="border-purple-500/20 bg-black/40 backdrop-blur-md text-white">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-bold">Add a Song</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    value={songUrl}
                    onChange={(e) => setSongUrl(e.target.value)}
                    placeholder="Search for a song..."
                    className="border-purple-500/30 bg-black/30 text-white placeholder:text-white/50 focus-visible:ring-purple-500/50"
                  />
                </div>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => addSongToStream()}
                >
                  Add to Queue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
