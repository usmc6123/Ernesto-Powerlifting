import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(455).json({ error: "Method not allowed. Use POST." });
  }

  const { password } = req.body;
  
  // Custom password from environment variable OR a fallback "password123"
  const expectedPassword = process.env.ADMIN_PASSWORD || "password123";

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (password === expectedPassword) {
    const secret = process.env.JWT_SECRET || "reyes-training-log-jwt-secret-key-12345";
    const token = jwt.sign({ uid: "reyes-training-uid" }, secret, {
      expiresIn: "30d",
    });
    return res.status(200).json({ token, uid: "reyes-training-uid" });
  } else {
    return res.status(401).json({ error: "Invalid password" });
  }
}
