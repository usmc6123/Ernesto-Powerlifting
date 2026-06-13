import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

let isInitialized = false;

export function getDb() {
  if (!process.env.FIREBASE_CONFIG) {
    throw new Error(
      "FIREBASE_CONFIG environment variable is not defined. Please configure it in your Settings/Secrets panel."
    );
  }

  if (!isInitialized) {
    try {
      if (!getApps().length) {
        const config = JSON.parse(process.env.FIREBASE_CONFIG);
        
        // Handle newline characters in the private key from stringified JSON
        if (config.private_key && typeof config.private_key === "string") {
          config.private_key = config.private_key.replace(/\\n/g, "\n");
        }

        initializeApp({
          credential: cert(config),
        });
      }
      isInitialized = true;
    } catch (err: any) {
      console.error("Error initializing Firebase Admin SDK:", err);
      throw new Error(`Firebase Admin SDK Initialization failed: ${err.message}`);
    }
  }

  return getFirestore();
}

/**
 * Seeding array representing real training data starting from Jan to June 2026.
 */
export const SEED_SESSIONS = [
  {
    date: "2026-01-05",
    note: "First session of 2026. Setting baselines.",
    type: "trained" as const,
    bodyWeight: 180.2,
    lifts: [
      {
        name: "Squat",
        workingWeight: 185,
        weightedSets: [
          [185, 5],
          [185, 5],
          [185, 5],
        ] as [number, number][],
        notes: "Squats felt heavier than usual after holidays.",
      },
      {
        name: "Bench Press",
        workingWeight: 135,
        weightedSets: [
          [135, 8],
          [135, 8],
          [135, 8],
        ] as [number, number][],
        notes: "Solid chest session.",
      },
    ],
  },
  {
    date: "2026-01-12",
    note: "Felt strong today. Moving Squats up.",
    type: "trained" as const,
    bodyWeight: 181.0,
    lifts: [
      {
        name: "Squat",
        workingWeight: 195,
        weightedSets: [
          [195, 5],
          [195, 5],
          [195, 5],
        ] as [number, number][],
        notes: "Power is coming back.",
      },
      {
        name: "Bench Press",
        workingWeight: 145,
        weightedSets: [
          [145, 6],
          [145, 6],
          [145, 6],
        ] as [number, number][],
        notes: "Bench feeling stable.",
      },
    ],
  },
  {
    date: "2026-01-18",
    note: "First Deadlift session of the year.",
    type: "trained" as const,
    bodyWeight: 180.8,
    lifts: [
      {
        name: "Deadlift",
        workingWeight: 225,
        weightedSets: [
          [225, 8],
          [225, 8],
        ] as [number, number][],
        notes: "Conventional. Focusing on tight lower back setup.",
      },
    ],
  },
  {
    date: "2026-02-01",
    note: "February baseline. Volume squats.",
    type: "trained" as const,
    bodyWeight: 181.5,
    lifts: [
      {
        name: "Squat",
        workingWeight: 205,
        weightedSets: [
          [205, 5],
          [205, 5],
          [205, 5],
        ] as [number, number][],
        notes: "Sweaty. Solid bar speed.",
      },
      {
        name: "Bench Press",
        workingWeight: 155,
        weightedSets: [
          [155, 5],
          [155, 5],
          [155, 5],
        ] as [number, number][],
        notes: "Rep record at this weight.",
      },
    ],
  },
  {
    date: "2026-02-15",
    note: "Felt under the weather, stayed home to rest.",
    type: "skipped" as const,
    bodyWeight: null,
    lifts: [],
  },
  {
    date: "2026-02-16",
    note: "Active recovery. Just a short walk and stretch.",
    type: "rest" as const,
    bodyWeight: 181.1,
    lifts: [],
  },
  {
    date: "2026-03-01",
    note: "Heavy Bench attempt today. Hit all reps.",
    type: "trained" as const,
    bodyWeight: 182.0,
    lifts: [
      {
        name: "Bench Press",
        workingWeight: 165,
        weightedSets: [
          [165, 5],
          [165, 5],
          [165, 5],
        ] as [number, number][],
        notes: "Toughest sets of the year but got it.",
      },
      {
        name: "Squat",
        workingWeight: 215,
        weightedSets: [
          [215, 5],
          [215, 5],
          [215, 5],
        ] as [number, number][],
        notes: "Pushed through leg fatigue.",
      },
    ],
  },
  {
    date: "2026-03-15",
    note: "Dumbbell & band session in living room.",
    type: "home" as const,
    bodyWeight: 182.2,
    lifts: [
      {
        name: "Deadlift",
        workingWeight: 245,
        weightedSets: [
          [245, 8],
          [245, 8],
        ] as [number, number][],
        notes: "Deficit deadlifts with lighter weight at home.",
      },
    ],
  },
  {
    date: "2026-04-05",
    note: "April starts. Heavy Deadlifts and Bench.",
    type: "trained" as const,
    bodyWeight: 183.1,
    lifts: [
      {
        name: "Deadlift",
        workingWeight: 275,
        weightedSets: [
          [275, 5],
          [275, 5],
          [275, 5],
        ] as [number, number][],
        notes: "Glutes firing excellently.",
      },
      {
        name: "Bench Press",
        workingWeight: 175,
        weightedSets: [
          [175, 4],
          [175, 4],
          [175, 3],
        ] as [number, number][],
        notes: "Missed last reps of third set. Heavy.",
      },
    ],
  },
  {
    date: "2026-04-18",
    note: "Quick workout, light squats.",
    type: "trained" as const,
    bodyWeight: 182.8,
    lifts: [
      {
        name: "Squat",
        workingWeight: 225,
        weightedSets: [
          [225, 5],
          [225, 5],
          [225, 5],
        ] as [number, number][],
        notes: "Squat milestone! Two plates is working weight.",
      },
    ],
  },
  {
    date: "2026-05-10",
    note: "Feeling incredibly fueled today.",
    type: "trained" as const,
    bodyWeight: 184.2,
    lifts: [
      {
        name: "Squat",
        workingWeight: 235,
        weightedSets: [
          [235, 5],
          [235, 4],
          [235, 3],
        ] as [number, number][],
        notes: "Rep count dropped near the end.",
      },
      {
        name: "Bench Press",
        workingWeight: 185,
        weightedSets: [
          [185, 5],
          [185, 5],
          [185, 4],
        ] as [number, number][],
        notes: "So close to clean completion.",
      },
    ],
  },
  {
    date: "2026-05-25",
    note: "Skipped to attend family dinner.",
    type: "skipped" as const,
    bodyWeight: null,
    lifts: [],
  },
  {
    date: "2026-06-01",
    note: "June starts with massive Deadlifts.",
    type: "trained" as const,
    bodyWeight: 184.5,
    lifts: [
      {
        name: "Deadlift",
        workingWeight: 315,
        weightedSets: [
          [315, 5],
          [315, 5],
          [315, 3],
        ] as [number, number][],
        notes: "Three plates conventional! Hard lockouts.",
      },
      {
        name: "Squat",
        workingWeight: 245,
        weightedSets: [
          [245, 3],
          [245, 3],
          [245, 3],
        ] as [number, number][],
        notes: "Triple reps. Depth felt shallow, check video.",
      },
    ],
  },
  {
    date: "2026-06-10",
    note: "Bench PR attempt. Pre-travel training.",
    type: "trained" as const,
    bodyWeight: 185.0,
    lifts: [
      {
        name: "Bench Press",
        workingWeight: 195,
        weightedSets: [
          [195, 2],
          [195, 2],
        ] as [number, number][],
        notes: "Very heavy doubles. Real grinding effort.",
      },
      {
        name: "Deadlift",
        workingWeight: 325,
        weightedSets: [
          [325, 3],
        ] as [number, number][],
        notes: "Felt amazing. Clean spinal posture.",
      },
    ],
  },
];

/**
 * Baseline goals to seed
 */
export const SEED_GOALS = [
  {
    id: "goal-bench",
    lift: "Bench Press",
    baselineWeight: 135,
    targetWeight: 225,
    targetDate: "2026-12-31",
  },
  {
    id: "goal-squat",
    lift: "Squat",
    baselineWeight: 185,
    targetWeight: 315,
    targetDate: "2026-12-31",
  },
  {
    id: "goal-deadlift",
    lift: "Deadlift",
    baselineWeight: 225,
    targetWeight: 405,
    targetDate: "2026-12-31",
  },
];

export async function checkAndSeed() {
  try {
    const db = getDb();
    const sessionsCol = db.collection("sessions");
    const snapshot = await sessionsCol.limit(1).get();

    if (snapshot.empty) {
      console.log("Firestore sessions are empty. Seeding data...");
      
      // Seed Sessions
      for (const s of SEED_SESSIONS) {
        await sessionsCol.add({
          ...s,
          createdAt: FieldValue.serverTimestamp(),
        });
      }

      // Seed Goals
      const goalsCol = db.collection("goals");
      const goalsSnapshot = await goalsCol.limit(1).get();
      if (goalsSnapshot.empty) {
        for (const g of SEED_GOALS) {
          await goalsCol.doc(g.id).set({
            ...g,
            createdAt: FieldValue.serverTimestamp(),
          });
        }
      }
      console.log("Seeding complete successfully.");
    }
  } catch (error) {
    console.error("Failed to seed data:", error);
  }
}
