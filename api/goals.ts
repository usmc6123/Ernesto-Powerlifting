import { Request, Response } from "express";
import { getDb } from "./firebaseAdmin";
import { verifyAuth } from "./authHelper";
import { FieldValue } from "firebase-admin/firestore";

export default async function handler(req: Request, res: Response) {
  let db;
  try {
    db = getDb();
  } catch (err: any) {
    return res.status(503).json({ error: err.message });
  }

  // Auth Guard
  const decoded = verifyAuth(req, res);
  if (!decoded) return;

  if (req.method === "GET") {
    try {
      const snapshot = await db.collection("goals").get();
      const goals: any[] = [];
      snapshot.forEach((doc) => {
        goals.push({ id: doc.id, ...doc.data() });
      });
      return res.status(200).json(goals);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "POST") {
    try {
      const { lift, baselineWeight, targetWeight, targetDate } = req.body;

      if (!lift || baselineWeight == null || targetWeight == null || !targetDate) {
        return res.status(400).json({ error: "Missing required fields for goal configuration" });
      }

      const docRef = await db.collection("goals").add({
        lift,
        baselineWeight: Number(baselineWeight),
        targetWeight: Number(targetWeight),
        targetDate,
        createdAt: FieldValue.serverTimestamp(),
      });

      return res.status(201).json({ id: docRef.id, message: "Goal registered successfully." });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(455).json({ error: "Method not allowed" });
  }
}
