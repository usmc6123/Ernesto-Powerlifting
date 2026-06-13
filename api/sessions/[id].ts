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
    return res.status(400).json({ error: "Missing session ID" });
  }

  const docRef = db.collection("sessions").doc(id);

  if (req.method === "GET") {
    try {
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return res.status(404).json({ error: "Session not found" });
      }
      const data = docSnap.data();
      return res.status(200).json({
        id: docSnap.id,
        ...data,
        createdAt: data?.createdAt ? data.createdAt.toDate?.()?.toISOString() || data.createdAt : null,
      });
    } catch (err: any) {
      console.error("GET session details error:", err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { date, note, type, lifts, bodyWeight } = req.body;

      if (!date || !type) {
        return res.status(400).json({ error: "Missing required fields (date, type)" });
      }

      // Check existence
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return res.status(404).json({ error: "Session not found" });
      }

      const validatedLifts = Array.isArray(lifts)
        ? lifts.map((l: any) => ({
            name: l.name || "",
            workingWeight: typeof l.workingWeight === "number" ? l.workingWeight : null,
            weightedSets: Array.isArray(l.weightedSets) ? l.weightedSets : [],
            notes: l.notes || "",
          }))
        : [];

      await docRef.update({
        date,
        note: note || "",
        type,
        lifts: validatedLifts,
        bodyWeight: typeof bodyWeight === "number" ? bodyWeight : null,
      });

      return res.status(200).json({ id, message: "Session updated successfully" });
    } catch (err: any) {
      console.error("PUT session error:", err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        return res.status(404).json({ error: "Session not found" });
      }

      await docRef.delete();
      return res.status(200).json({ id, message: "Session deleted successfully" });
    } catch (err: any) {
      console.error("DELETE session error:", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(455).json({ error: "Method not allowed" });
  }
}
