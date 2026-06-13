export type SessionType = "trained" | "skipped" | "rest" | "home";

export interface WeightedSet {
  weight: number;
  reps: number;
}

export interface Lift {
  name: string;
  workingWeight: number | null;
  weightedSets: [number, number][]; // [weight, reps] pairs
  notes: string;
}

export interface Session {
  id: string;
  date: string; // YYYY-MM-DD
  note: string;
  type: SessionType;
  lifts: Lift[];
  bodyWeight: number | null;
  createdAt?: any;
}

export interface Goal {
  id: string;
  lift: string; // e.g. "Bench Press"
  targetWeight: number;
  targetDate: string; // YYYY-MM-DD
  baselineWeight: number;
  createdAt?: any;
}

export interface PersonalRecord {
  lift: string;
  weight: number;
  date: string;
}

export interface LiftStats {
  lift: string;
  currentEstimated1RM: number;
  bestWeight: number;
  totalSets: number;
  progression: {
    date: string;
    workingWeight: number;
    totalReps: number;
    estimated1RM: number;
  }[];
}

export interface MonthlyStats {
  month: string; // YYYY-MM
  sessionsCount: number;
  skippedCount: number;
  restCount: number;
  hitRate: number;
  bestBench: number | null;
  bestSquat: number | null;
  bestDeadlift: number | null;
}

export interface ComputedStats {
  monthlyStats: { [key: string]: { trained: number; skipped: number; rest: number; hitRate: number } };
  prHistory: PersonalRecord[];
  streaks: {
    currentStreak: number;
  };
  oneRMEstimates: {
    bench: number;
    squat: number;
    deadlift: number;
  };
  liftStats: {
    bench: LiftStats;
    squat: LiftStats;
    deadlift: LiftStats;
  };
  allMonthsCompare: MonthlyStats[];
}
