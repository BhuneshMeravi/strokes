import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/clients";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  userId: string;
  rooms: string[];
  ws: WebSocket;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded == "string") {
      return null;
    }
    if (!decoded || !(decoded as JwtPayload).userId) {
      return null;
    }
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;

  if (!url) {
    ws.close();
    return;
  }

  const queryParam = new URLSearchParams(url.split("?")[1]);
  const token = queryParam.get("token") || "";

  const userId = checkUser(token);
  if (userId === null) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });
  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_rooom") {
      const user = users.find((x) => x.ws == ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter((x) => x == parsedData.room);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      await prismaClient.chat.create({
        data: {
          roomId,
          message,
          userId
        }
      })

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            })
          );
        }
      });
    }
  });
});
