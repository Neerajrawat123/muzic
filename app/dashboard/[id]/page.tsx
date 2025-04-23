"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Music, Users, ThumbsUp} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { WaveBackground } from "@/components/wave-background";
import { useSession } from "next-auth/react";
import axios from "axios";
import ReactPlayer from "react-player/lazy";
import Loader from "@/app/dashboard/loading";
import { useParams } from "next/navigation";
import { ClimbingBoxLoader } from "react-spinners";


type Video = {
  active: boolean;
  bigPic: string;
  creator: string;

  extractedId: string;
  upvotes: [
    {
      id: string;
      streamId: string;
      userId: string;
    },
  ];

  id: string;

  smallPic: string;

  spaceId: string | null;

  title: string;

  type: string;

  url: string;

  userid: string;

  _count: { upvotes: number };
};

interface RoomData {
  name: string;
  code: string;
  id: string;
  currentStream: currentStream | null;
}

type currentStream = {
  id: string;
  streamId: string;
  userId: string;
  spaceId: string;
};

type Member = {
  id: string;
  userType: string;
  user: {
    name: string;
    id: string;
  };
};

export default function Dashboard() {
  const id = useParams().id;
  const [currentSong, setCurrentSong] = useState<Video | null>(null);
  const [queue, setQueue] = useState<Video[]>([]);
  const [songUrl, setSongUrl] = useState("");
  const { data: session } = useSession();
  const [roomCode, setRoomCode] = useState("");
  const [room, setRoom] = useState<RoomData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTextCopy, setIsTextCopy] = useState(false);
  const [isAddingSong, setIsAddingSong] = useState(false);

  const getStreams = useCallback(async () => {
    if (!room?.id) {
      console.log("No room id available yet");
      return;
    }
    try {
      console.log("Fetching streams for room:", room.id);
      const response = await axios.get(`/api/streams?spaceId=${room.id}`);

      if (response.status === 202) {
        setCurrentSong(null);
        setQueue([]);
        return;
      }

      const streams: Video[] = typeof response.data.streams === "string"
        ? JSON.parse(response.data.streams)
        : response.data.streams;

      const currentStream: currentStream = typeof response.data.streams === "string"
        ? JSON.parse(response.data.currentStream)
        : response.data.currentStream;

      const newCurrentSong = streams.find((stream) => stream.id === currentStream.streamId) || null;

      if (newCurrentSong?.id !== currentSong?.id) {
        console.log("helo", newCurrentSong);
        setCurrentSong(newCurrentSong);
      }

      const newQueue = streams.filter(
        (stream) => stream.id !== newCurrentSong?.id
      );
      setQueue(newQueue);
    } catch (error) {
      console.error(error);
    }
  }, [room?.id, currentSong?.id]);

  const getRoomDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/room?code=${id}`);
      if (response.status === 200) {
        const roomData = typeof response.data.room === "string"
          ? JSON.parse(response.data.room)
          : response.data.room;

        let membersData = typeof response.data.members === "string"
          ? JSON.parse(response.data.members)
          : response.data.members;

        if (!roomData || !membersData) {
          throw new Error("Invalid room data received");
        }

        membersData = membersData.sort((a: Member, b: Member) => {
          if (a.userType === "host") return -1;
          if (b.userType === "host") return 1;
          return 0;
        });

        setMembers(membersData);
        
        const currentStream = roomData.currentStream || null;
        
        const newRoom = {
          name: roomData.name || "",
          code: roomData.code || "",
          id: roomData.id || "",
          currentStream,
        };

        if (!newRoom.id || !newRoom.code) {
          throw new Error("Missing required room data");
        }

        setRoom(newRoom);
        setRoomCode(newRoom.code);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load room details";
      setError(errorMessage);
      console.error("Room details error:", error);
      throw error;
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await getRoomDetails();
        if (room?.id) {
          await getStreams();
        }
      } catch (err) {
        setError("Failed to load room data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getRoomDetails, getStreams, room?.id]);

  // Add another useEffect to handle room changes
  useEffect(() => {
    if (room?.id) {
      getStreams();
    }
  }, [room?.id, getStreams]);

  // Add useEffect to handle song changes
  useEffect(() => {
    if (currentSong?.url) {
      console.log("Current song changed:", currentSong.title);
    }
  }, [currentSong?.url, currentSong?.title]);

  const handleVote = async (id: string, isUpvote: boolean) => {
    try {
      // Optimistic update
      setQueue(prevQueue => 
        prevQueue.map(song => {
          if (song.id === id) {
            return {
              ...song,
              _count: {
                ...song._count,
                upvotes: isUpvote 
                  ? song._count.upvotes - 1 
                  : song._count.upvotes + 1
              }
            };
          }
          return song;
        })
      );

      const voteResponse = await axios({
        method: "post",
        url: `/api/streams/${isUpvote ? "downvotes" : "upvotes"}?id=${id}`,
      });

      if (voteResponse.status !== 200) {
        // Revert optimistic update if the API call fails
        await getStreams();
        throw new Error("Failed to update vote");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process vote";
      setError(errorMessage);
      console.error("Vote error:", error);
      // Revert optimistic update
      await getStreams();
    }
  };

  // Add debounced copy function
  const copyRoomCode = useCallback(() => {
    if (room?.code) {
      navigator.clipboard.writeText(room.code);
      setIsTextCopy(true);
      setTimeout(() => setIsTextCopy(false), 2000);
    }
  }, [room?.code]);

  const addSongToStream = async () => {
    if (!songUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }
    if (isAddingSong) return; // Prevent multiple submissions

    try {
      setIsAddingSong(true);
      const response = await axios.post("/api/streams", {
        type: "Youtube",
        userId: session?.user?.id,
        url: songUrl,
        spaceId: room?.id,
      });

      if (response.status === 201) {
        setSongUrl("");
        await getStreams();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add song to stream";
      setError(errorMessage);
      console.error("Error adding song to stream:", error);
    } finally {
      setIsAddingSong(false);
    }
  };

  async function playnext() {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `/api/streams/delete?id=${currentSong?.id}`
      );
      if (response.status === 200) {
        await getStreams();
      }
    } catch (error) {
      setError("Failed to skip to next song");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <WaveBackground />

      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <ClimbingBoxLoader color="#9333ea" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <Card className="border-red-500/20 bg-black/40 backdrop-blur-md text-white p-6">
            <h3 className="text-lg font-bold text-red-400">Error</h3>
            <p className="text-sm text-white/70">{error}</p>
            <Button
              className="mt-4 bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
            >
              Retry
            </Button>
          </Card>
        </div>
      ) : (
        <>
          {/* Navigation */}
          <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                  <Music className="h-6 w-6 text-purple-400" />
                  <span className="text-xl font-bold text-white">
                    MusicRoom
                  </span>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-purple-500/50 text-white"
                >
                  <Users className="h-7 w-7" />
                  <span>Room: {room?.name}</span>
                </Badge>
                <Avatar>
                  <AvatarFallback className="text-lg cursor-pointer">
                    {session?.user ? session?.user?.name?.slice(0, 1) : ""}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <div className="container grid flex-1 gap-6 px-4 py-2 md:grid-cols-[1fr_300px] md:px-6 lg:grid-cols-[1fr_350px]">
            <div className="flex flex-col gap-6">
              {/* Now Playing */}
              <Card className="overflow-hidden border-purple-500/20 bg-black/40 backdrop-blur-md">
                <Suspense fallback={<Loader isLoading={true} />}>
                  {currentSong ? (
                    <ReactPlayer
                      width={"100%"}
                      height={"450px"}
                      url={currentSong.url}
                      controls
                      onEnded={() => playnext()}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[450px] bg-black/20">
                      <p className="text-white/70">No song currently playing</p>
                    </div>
                  )}
                </Suspense>
                {currentSong && (
                  <CardContent className="py-2 px-3 text-white">
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
                            src={"/google.png"}
                            alt="creater of the song"
                          />
                          <AvatarFallback>
                            {members[0]?.user?.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-white/70">
                          Added by {}
                          <span className="text-lg ml-1 font-medium">
                            {session?.user?.name}
                          </span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Song Queue */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Up Next</h2>
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
                  {queue.length > 0 ? (
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
                                src={song?.bigPic || "/images/google.svg"}
                                fill
                                alt={song?.title}
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/images/fallback.svg";
                                }}
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
                              {
                                <span className="font-medium">
                                  {song._count.upvotes}
                                </span>
                              }
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-green-400 hover:bg-green-500/20 hover:text-green-300"
                              onClick={() =>
                                handleVote(song.id, !!song.upvotes.length)
                              }
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-20 bg-black/20">
                      <p className="text-white/70">No song in queue</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Room Info */}
              <Card className="border-purple-500/20 bg-black/40 backdrop-blur-md text-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold">Room: {room?.name}</h3>
                  <p className="text-sm text-white/70">
                    Created by {members[0]?.user?.name}
                  </p>
                  <Separator className="my-4 bg-purple-500/20" />
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">{room?.name}</h4>
                      <div className="flex items-center gap-2">
                        <Input
                          value={roomCode}
                          readOnly
                          className="border-purple-500/30 bg-black/30 text-white focus-visible:ring-purple-500/50"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-500/50 hover:bg-purple-500/20 text-black hover:text-white"
                          onClick={copyRoomCode}
                        >
                          {isTextCopy ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">
                        Room Settings
                      </h4>
                      <div className="space-y-2">
                        {/* <div className="flex items-center justify-between">
                          <span className="text-sm">Public Room</span>
                          <Badge
                            variant="outline"
                            className="border-purple-500/50"
                          >
                            On
                          </Badge>
                        </div> */}
                        {/* <div className="flex items-center justify-between">
                          <span className="text-sm">Max Queue</span>
                          <Badge
                            variant="outline"
                            className="border-purple-500/50"
                          >
                            50 songs
                          </Badge>
                        </div> */}
                        <div className="flex items-center justify-between bg-transparent">
                          <Button
                            className="bg-purple-700"
                            onClick={() => playnext()}
                          >
                            <span className="text-sm ">Skip song</span>
                          </Button>
                          {/* <Badge
                            variant="outline"
                            className="border-purple-500/50"
                          >
                            5 votes
                          </Badge> */}
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
                    <Badge className="bg-purple-600">{members?.length}</Badge>
                  </div>
                  <Separator className="my-4 bg-purple-500/20" />
                  <div className="space-y-4">
                    {members?.map((user) => (
                      <div key={user.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={"/google.png"}
                            alt={user.user.name}
                          />
                          <AvatarFallback className="text-black">
                            {user.user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.user.name}</div>
                          {user.userType === "host" && (
                            <div className="text-xs text-purple-400">
                              Room Host
                            </div>
                          )}
                          {session?.user?.id === user.user.id &&
                            user.userType !== "host" && (
                              <div className="text-xs text-white/50">You</div>
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
                      onClick={addSongToStream}
                      disabled={isAddingSong}
                    >
                      {isAddingSong ? "Adding..." : "Add to Queue"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
