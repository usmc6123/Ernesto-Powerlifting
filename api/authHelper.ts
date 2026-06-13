import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export function verifyAuth(req: Request, res: Response): { uid: string } | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid token" });
    return null;
  }
  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "reyes-training-log-jwt-secret-key-12345";
    const decoded = jwt.verify(token, secret) as { uid: string };
    if (decoded.uid !== "reyes-training-uid") {
      res.status(403).json({ error: "Forbidden: Invalid user claim" });
      return null;
    }
    return decoded;
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    return null;
  }
}
