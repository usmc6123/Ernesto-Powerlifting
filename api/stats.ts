import { Request, Response } from "express";
import { getDb } from "./firebaseAdmin";
import { verifyAuth } from "./authHelper";

export default async function handler(req: Request, res: Response) {
  let db;
  try {
    db = getDb();
  } catch (err: any) {
    return res.status(503).json({ error: err.message });
  }

  const decoded = verifyAuth(req, res);
  if (!decoded) return;

  if (req.method !== "GET") {
    return res.status(455).json({ error: "Method not allowed" });
  }

  try {
    // Current date is 2026-06-13 according to system metadata, but let's check current date dynamically or lock it if needed.
    // Let's use the actual server date, but make sure the year 2026 is fully supported as the year of interest.
    const now = new Date();
    // Default to the correct current local date in YYYY-MM-DD
    const todayStr = now.toISOString().split("T")[0]; // "2026-06-13" or similar

    const sessionsRef = db.collection("sessions");
    const querySnapshot = await sessionsRef.get();
    const sessionsList: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessionsList.push({
        id: doc.id,
        ...data,
      });
    });

    // Sort chronologically (ascending)
    sessionsList.sort((a, b) => a.date.localeCompare(b.date));

    // Helpers to identify lifts
    const isBench = (name: string) => {
      const l = name.toLowerCase();
      return l === "bench press" || l === "bench" || l.includes("bench");
    };
    const isSquat = (name: string) => {
      const l = name.toLowerCase();
      return l === "squat" || l.includes("squat");
    };
    const isDeadlift = (name: string) => {
      const l = name.toLowerCase();
      return l === "deadlift" || l.includes("deadlift") || l.includes("dead lift");
    };

    // 1. 1RM Estimation (Epley formula: weight * (1 + reps/30))
    // Also track working progression for chart.js
    let maxBench1RM = 0;
    let maxSquat1RM = 0;
    let maxDeadlift1RM = 0;

    let bestBenchWeight = 0;
    let bestSquatWeight = 0;
    let bestDeadliftWeight = 0;

    const benchProgression: any[] = [];
    const squatProgression: any[] = [];
    const deadliftProgression: any[] = [];

    // All-time Personal Records (PRs) detection
    const prHistory: { lift: string; weight: number; date: string }[] = [];
    let runningMaxBench = 0;
    let runningMaxSquat = 0;
    let runningMaxDeadlift = 0;

    sessionsList.forEach((session) => {
      if (session.type === "trained" || session.type === "home") {
        session.lifts?.forEach((lift: any) => {
          const sets = Array.isArray(lift.weightedSets) ? lift.weightedSets : [];
          
          // Max set weight in this lift
          const setWeights = sets.map((s: any) => Number(s[0] || 0));
          const maxSetWeight = setWeights.length > 0 ? Math.max(...setWeights) : 0;
          const wWeight = Number(lift.workingWeight) || maxSetWeight || null;

          // Compute max estimated 1RM for this lift in this session
          let sessionMax1RM = 0;
          let totalRepsInLift = 0;
          sets.forEach((set: any) => {
            const weight = Number(set[0] || 0);
            const reps = Number(set[1] || 0);
            totalRepsInLift += reps;
            if (reps > 0) {
              const est = weight * (1 + reps / 30);
              if (est > sessionMax1RM) sessionMax1RM = est;
            }
          });

          if (isBench(lift.name)) {
            if (wWeight && wWeight > 0) {
              benchProgression.push({
                date: session.date,
                workingWeight: wWeight,
                totalReps: totalRepsInLift,
                estimated1RM: Math.round(sessionMax1RM),
              });
              if (wWeight > runningMaxBench) {
                runningMaxBench = wWeight;
                prHistory.push({ lift: "Bench Press", weight: wWeight, date: session.date });
              }
              if (wWeight > bestBenchWeight) bestBenchWeight = wWeight;
            }
            if (sessionMax1RM > maxBench1RM) maxBench1RM = sessionMax1RM;
          } else if (isSquat(lift.name)) {
            if (wWeight && wWeight > 0) {
              squatProgression.push({
                date: session.date,
                workingWeight: wWeight,
                totalReps: totalRepsInLift,
                estimated1RM: Math.round(sessionMax1RM),
              });
              if (wWeight > runningMaxSquat) {
                runningMaxSquat = wWeight;
                prHistory.push({ lift: "Squat", weight: wWeight, date: session.date });
              }
              if (wWeight > bestSquatWeight) bestSquatWeight = wWeight;
            }
            if (sessionMax1RM > maxSquat1RM) maxSquat1RM = sessionMax1RM;
          } else if (isDeadlift(lift.name)) {
            if (wWeight && wWeight > 0) {
              deadliftProgression.push({
                date: session.date,
                workingWeight: wWeight,
                totalReps: totalRepsInLift,
                estimated1RM: Math.round(sessionMax1RM),
              });
              if (wWeight > runningMaxDeadlift) {
                runningMaxDeadlift = wWeight;
                prHistory.push({ lift: "Deadlift", weight: wWeight, date: session.date });
              }
              if (wWeight > bestDeadliftWeight) bestDeadliftWeight = wWeight;
            }
            if (sessionMax1RM > maxDeadlift1RM) maxDeadlift1RM = sessionMax1RM;
          }
        });
      }
    });

    // 2. Streaks
    // Count consecutive calendar days going back from today where type is "trained" or "home" with lifts, skip "rest" days
    // Stop counting when a non-rest, non-trained day is hit (either skipped, or no session logged)
    let currentStreak = 0;
    const sessionMap: { [dateStr: string]: any } = {};
    sessionsList.forEach((s) => {
      sessionMap[s.date] = s;
    });

    let streakDate = new Date(todayStr);
    let keepChecking = true;

    while (keepChecking) {
      const dateKey = streakDate.toISOString().split("T")[0];
      const session = sessionMap[dateKey];

      if (session) {
        if (session.type === "trained" || (session.type === "home" && session.lifts?.length > 0)) {
          currentStreak++;
          streakDate.setDate(streakDate.getDate() - 1);
        } else if (session.type === "rest") {
          // Rest days do not count towards the streak, but they do NOT break it either
          streakDate.setDate(streakDate.getDate() - 1);
        } else {
          // Skipped session breaks the streak
          keepChecking = false;
        }
      } else {
        // No log on this elapsed day means it is a skipped day, which breaks the training streak
        keepChecking = false;
      }
    }

    // 3. Month by Month Stats calculation for 2026
    // We want to calculate states for Jan-Dec 2026.
    // For past months, all days are elapsed. For current month, up to today is elapsed. For future, none.
    const months = [
      { name: "Jan 2026", key: "2026-01", days: 31 },
      { name: "Feb 2026", key: "2026-02", days: 28 }, // 2026 is not a leap year
      { name: "Mar 2026", key: "2026-03", days: 31 },
      { name: "Apr 2026", key: "2026-04", days: 30 },
      { name: "May 2026", key: "2026-05", days: 31 },
      { name: "Jun 2026", key: "2026-06", days: 30 },
      { name: "Jul 2026", key: "2026-07", days: 31 },
      { name: "Aug 2026", key: "2026-08", days: 31 },
      { name: "Sep 2026", key: "2026-09", days: 30 },
      { name: "Oct 2026", key: "2026-10", days: 31 },
      { name: "Nov 2026", key: "2026-11", days: 30 },
      { name: "Dec 2026", key: "2026-12", days: 31 },
    ];

    const monthlyStats: { [monthKey: string]: { trained: number; skipped: number; rest: number; hitRate: number } } = {};
    const allMonthsCompareList: any[] = [];

    months.forEach((m) => {
      let trainedCount = 0;
      let restCount = 0;
      let skippedCount = 0;

      // Find the range of elapsed days for this month
      // Loop over days of this month
      const monthYear = 2026;
      const monthNum = parseInt(m.key.split("-")[1], 10);

      // Loop day by day
      for (let day = 1; day <= m.days; day++) {
        const dayStr = `${monthYear}-${String(monthNum).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        
        // Only count if day is <= todayStr
        if (dayStr <= todayStr) {
          const s = sessionMap[dayStr];
          if (s) {
            if (s.type === "trained" || (s.type === "home" && s.lifts?.length > 0)) {
              trainedCount++;
            } else if (s.type === "rest") {
              restCount++;
            } else {
              skippedCount++;
            }
          } else {
            // Elapsed day with no session logged is skipped
            skippedCount++;
          }
        }
      }

      // Hit rate calculation
      const denominator = trainedCount + skippedCount;
      const hitRate = denominator > 0 ? (trainedCount / denominator) * 100 : 100;

      monthlyStats[m.key] = {
        trained: trainedCount,
        skipped: skippedCount,
        rest: restCount,
        hitRate: Math.round(hitRate),
      };

      // Best lift weights in this month
      let bestMonthBench: number | null = null;
      let bestMonthSquat: number | null = null;
      let bestMonthDeadlift: number | null = null;

      sessionsList.forEach((s) => {
        if (s.date.startsWith(m.key) && (s.type === "trained" || s.type === "home")) {
          s.lifts?.forEach((lift: any) => {
            const setWeights = (lift.weightedSets || []).map((set: any) => Number(set[0] || 0));
            const maxW = Math.max(Number(lift.workingWeight) || 0, ...setWeights);
            
            if (maxW > 0) {
              if (isBench(lift.name)) {
                if (bestMonthBench === null || maxW > bestMonthBench) bestMonthBench = maxW;
              } else if (isSquat(lift.name)) {
                if (bestMonthSquat === null || maxW > bestMonthSquat) bestMonthSquat = maxW;
              } else if (isDeadlift(lift.name)) {
                if (bestMonthDeadlift === null || maxW > bestMonthDeadlift) bestMonthDeadlift = maxW;
              }
            }
          });
        }
      });

      allMonthsCompareList.push({
        month: m.key,
        sessionsCount: trainedCount,
        skippedCount,
        restCount,
        hitRate: Math.round(hitRate),
        bestBench: bestMonthBench,
        bestSquat: bestMonthSquat,
        bestDeadlift: bestMonthDeadlift,
      });
    });

    const statsResponse = {
      monthlyStats,
      prHistory: prHistory.reverse(), // Newest PR first
      streaks: {
        currentStreak,
      },
      oneRMEstimates: {
        bench: Math.round(maxBench1RM),
        squat: Math.round(maxSquat1RM),
        deadlift: Math.round(maxDeadlift1RM),
      },
      liftStats: {
        bench: {
          lift: "Bench Press",
          currentEstimated1RM: Math.round(maxBench1RM),
          bestWeight: bestBenchWeight,
          totalSets: benchProgression.length,
          progression: benchProgression,
        },
        squat: {
          lift: "Squat",
          currentEstimated1RM: Math.round(maxSquat1RM),
          bestWeight: bestSquatWeight,
          totalSets: squatProgression.length,
          progression: squatProgression,
        },
        deadlift: {
          lift: "Deadlift",
          currentEstimated1RM: Math.round(maxDeadlift1RM),
          bestWeight: bestDeadliftWeight,
          totalSets: deadliftProgression.length,
          progression: deadliftProgression,
        },
      },
      allMonthsCompare: allMonthsCompareList,
    };

    return res.status(200).json(statsResponse);
  } catch (err: any) {
    console.error("GET /api/stats calculation error:", err);
    return res.status(500).json({ error: err.message });
  }
}
