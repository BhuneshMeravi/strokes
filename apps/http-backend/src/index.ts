import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {
  CreateUserSchema,
  SignInSchema,
  CreateRoomSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/clients";
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        name: data.data.name,
        email: data.data.username,
        password: data.data.password,
        // TODO: hashed the password
      },
    });
    //db call
    res.json({ userId: user.id });
  } catch (error) {
    res.status(411).json({ message: "user already exist with this username" });
  }
});

app.post("/signin", async (req, res) => {
  const data = SignInSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }

  //TODO: compare the hashed password here
  const user = await prismaClient.user.findFirst({
    where: {
      email: data.data.username,
      password: data.data.password,
    },
  });

  if(!user){
    res.status(403).json({
      message: "user is not authorised"
    })
    return
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token });
});

app.post("/room", middleware, async (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      message: "Incorrect inputs",
    });
    return;
  }
  //@ts-ignore: TODO: fix this
  const userId = req.userId

  try {
    const room = await prismaClient.room.create({
      data:{
        slug: data.data.name,
        adminId: userId 
      }  
    })
  
    res.json({ roomId: room.id });
  } catch (error) {
    res.status(411).json({
      message: "room already exist with this name"
    })
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId)
  const messages = await prismaClient.room.findMany({
    where: {
      id: roomId,
    },
    take: 50
  })

  res.json({
    messages
  })
})

app.listen(3001);
