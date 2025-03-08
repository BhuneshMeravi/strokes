"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { messages: string }[];
  id: string;
}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [chats, setChats] = useState(messages);
  const { loading, socket } = useSocket();

  useEffect(() => {
    if (socket && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parseData = JSON.parse(event.data);
        if (parseData.type === "chat") {
          setChats((c) => [...c, { messages: parseData.message }]);
        }
      };
    }
    return ()=> {
      socket?.close()
    }
  }, [socket, loading, id]);

  return (
    <div>
      {chats.map((m) => (
        <div>{m.messages}</div>
      ))}

      <input
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      ></input>

      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              type: "chat",
              roomId: id,
              message: currentMessage,
            })
          );
          setCurrentMessage("")
        }}
      >Send Message</button>
    </div>
  );
}
