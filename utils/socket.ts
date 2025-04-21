// utils/socket.ts
import { io, Socket } from "socket.io-client";
import { ResponseType } from "@/types/ws"; // assuming this defines ResponseType

interface ServerToClientEvents {
  message: (msg: string) => void;
}

interface ClientToServerEvents {
  sendMessage: (msg: string) => void;
  create_room: (
    roomName: string,
    roomCode: string,
    callback: (response: ResponseType) => void
  ) => void;
  join_room: (
    roomCode: string,
    callback: (response: ResponseType) => void
  ) => void;
}

// Singleton instance
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:4000", {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false, // important: prevents auto-connect on import
});

export default socket;
