"use client";

import { WS_URL } from "@/config";
import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0YTI2ZGRhNC0wYWZhLTQ5N2QtYTU5NS05Zjg1MDk0OTVkZTAiLCJpYXQiOjE3NDM2MDAzOTJ9.Vw41K8jCZqkp1EKZI6yaEq4WhtXnyAGTm2O7gPQ2mU8`
    );

    ws.onopen = () => {
      setSocket(ws);
      ws.send(JSON.stringify({ type: "join_room", roomId }));
    };
  }, []);

  if (!socket) {
    return <div>Connecting to server...</div>;
  }

  return (
    <div>
      <Canvas roomId={roomId} socket={socket} />
      <div className="absolute botton-0 right-0">
        <button className="bg-white text-black">{"rect"}</button>
        <button className="bg-white text-black">{"circle"}</button>
      </div>
    </div>
  );
}
