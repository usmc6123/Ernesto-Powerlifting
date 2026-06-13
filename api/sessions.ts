import { Request, Response } from "express";
import { getDb, checkAndSeed } from "./firebaseAdmin";
import { verifyAuth } from "./authHelper";
import { FieldValue } from "firebase-admin/firestore";

export default async function handler(req: Request, res: Response) {
  // Ensure lazy-init database and trigger initial seed if empty
  let db;
  try {
    db = getDb();
  } catch (err: any) {
    return res.status(503).json({ error: err.message });
  }

  // Seeding happens with standard sessions loading
  await checkAndSeed();

  // Verify auth for all operations here
  const decoded = verifyAuth(req, res);
  if (!decoded) return; // verifyAuth handles sending error response

  if (req.method === "GET") {
    try {
      const { month } = req.query; // YYYY-MM
      const sessionsRef = db.collection("sessions");
      
      let querySnapshot = await sessionsRef.get();
      let sessionsList: any[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessionsList.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate?.()?.toISOString() || data.createdAt : null,
        });
      });

      // Sort by date descending
      sessionsList.sort((a, b) => b.date.localeCompare(a.date));

      // Filter by month (YYYY-MM) if specified
      if (month && typeof month === "string") {
        sessionsList = sessionsList.filter((s) => s.date.startsWith(month));
      }

      return res.status(200).json(sessionsList);
    } catch (err: any) {
      console.error("GET /api/sessions error:", err);
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === "POST") {
    try {
      const { date, note, type, lifts, bodyWeight } = req.body;

      if (!date || !type) {
        return res.status(400).json({ error: "Missing required fields (date, type)" });
      }

      // Format check (lifts validation)
      const validatedLifts = Array.isArray(lifts)
        ? lifts.map((l: any) => ({
            name: l.name || "",
            workingWeight: typeof l.workingWeight === "number" ? l.workingWeight : null,
            weightedSets: Array.isArray(l.weightedSets) ? l.weightedSets : [],
            notes: l.notes || "",
          }))
        : [];

      const docRef = await db.collection("sessions").add({
        date,
        note: note || "",
        type,
        lifts: validatedLifts,
        bodyWeight: typeof bodyWeight === "number" ? bodyWeight : null,
        createdAt: FieldValue.serverTimestamp(),
      });

      return res.status(201).json({ id: docRef.id, message: "Session created successfully." });
    } catch (err: any) {
      console.error("POST /api/sessions error:", err);
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(455).json({ error: "Method not allowed" });
  }
}
