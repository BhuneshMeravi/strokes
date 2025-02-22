import { NextFunction, Request, Response, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export const middleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (!decoded || typeof decoded !== "object" || !decoded.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  (req as any).userId = decoded.userId; // Attach userId to req

  next();
};
