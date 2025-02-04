import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

//   req.body.userId = decoded.userId;

  next();
};
