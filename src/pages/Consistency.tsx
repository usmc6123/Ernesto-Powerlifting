import React from "react";
import { Calendar } from "lucide-react";
import { Session } from "../types";
import StatRow from "../components/StatRow";
import CalendarGrid from "../components/CalendarGrid";

interface ConsistencyProps {
  selectedMonth: string; // "2026-MM"
  sessions: Session[];
  monthlyStatsMap?: { [monthKey: string]: { trained: number; skipped: number; rest: number; hitRate: number } };
}

export default function Consistency({ selectedMonth, sessions, monthlyStatsMap }: ConsistencyProps) {
  // Get monthly consistency statistics
  const currentMonthStats = monthlyStatsMap?.[selectedMonth] || {
    trained: 0,
    skipped: 0,
    rest: 0,
    hitRate: 0,
  };

  const statItems = [
    {
      label: "TRAINED DAYS",
      value: `${currentMonthStats.trained} DAYS`,
      subtext: "GYM & HOME COMBINED",
    },
    {
      label: "SKIPPED DAYS",
      value: `${currentMonthStats.skipped} DAYS`,
      subtext: "MISSED LOGS / DEFAULTS",
    },
    {
      label: "REST DAYS",
      value: `${currentMonthStats.rest} DAYS`,
      subtext: "RECOVERY & ACTIVE REST STRATEGY",
    },
    {
      label: "MONTHLY HIT RATE",
      value: `${currentMonthStats.hitRate}%`,
      subtext: "TRAINED / (TRAINED + SKIPPED)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* View Title Header */}
      <div className="border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] select-none">
        <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
          CONSISTENCY & CALENDAR HEATMAP — {selectedMonth}
        </h2>
        <p className="text-[10px] font-sans text-[#aaaaaa] mt-1">
          A visual tracker representing your training discipline mapped across calendar elapsed days.
        </p>
      </div>

      {/* 4-Stat consistency row */}
      <StatRow items={statItems} />

      {/* Calendar Grid component */}
      <CalendarGrid selectedMonth={selectedMonth} sessions={sessions} />
    </div>
  );
}
