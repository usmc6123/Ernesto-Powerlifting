import { Request, Response } from "express";
import { getDb } from "../firebaseAdmin";
import { verifyAuth } from "../authHelper";

export default async function handler(req: Request, res: Response) {
  let db;
  try {
    db = getDb();
  } catch (err: any) {
    return res.status(503).json({ error: err.message });
  }

  const decoded = verifyAuth(req, res);
  if (!decoded) return;

  const id = (req.params.id || req.query.id) as string;
  if (!id) {
    return res.status(400).json({ error: "Missing goal ID" });
  }

  const docRef = db.collection("goals").doc(id);

  if (req.method === "PUT") {
    try {
      const { lift, targetWeight, targetDate, baselineWeight } = req.body;

      if (!lift || !targetWeight || !targetDate || typeof baselineWeight !== "number") {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if goal exists
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return res.status(404).json({ error: "Goal not found" });
      }

      await docRef.update({
        lift,
        targetWeight: Number(targetWeight),
        targetDate,
        baselineWeight: Number(baselineWeight),
      });

      return res.status(200).json({ id, message: "Goal updated successfully" });
    } catch (err: any) {
      console.error("PUT goal error:", err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return res.status(404).json({ error: "Goal not found" });
      }

      await docRef.delete();
      return res.status(200).json({ id, message: "Goal deleted successfully" });
    } catch (err: any) {
      console.error("DELETE goal error:", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(455).json({ error: "Method not allowed" });
  }
}
