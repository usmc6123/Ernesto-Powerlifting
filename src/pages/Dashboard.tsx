import React, { useState, useEffect } from "react";
import {
  Trophy,
  Activity,
  Flame,
  Weight,
  Layers,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Target,
} from "lucide-react";
import { Session, Goal, ComputedStats } from "../types";
import { api } from "../lib/api";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.JS line elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip, ChartLegend, Filler);

import Header from "../components/Header";
import MonthBar from "../components/MonthBar";
import StatRow from "../components/StatRow";
import GoalBar from "../components/GoalBar";
import ProgressChart from "../components/ProgressChart";

// Subpages
import SessionsView from "./Sessions";
import ConsistencyView from "./Consistency";
import CompareView from "./Compare";
import LogModal from "../components/LogModal";
import SettingsModal from "../components/SettingsModal";

interface DashboardProps {
  onLogout: () => void;
  theme: string;
  setTheme: (theme: string) => void;
}

export default function Dashboard({ onLogout, theme, setTheme }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "sessions" | "consistency" | "compare">("dashboard");
  const [selectedMonth, setSelectedMonth] = useState("2026-06"); // Set default to June 2026 which matches current system local date
  const [showSettings, setShowSettings] = useState(false);
  
  // States
  const [sessions, setSessions] = useState<Session[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [stats, setStats] = useState<ComputedStats | null>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<Session | null>(null);

  // Goal creation inline state
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [newGoalLift, setNewGoalLift] = useState("Bench Press");
  const [newGoalBaseline, setNewGoalBaseline] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("2026-12-31");

  // Loading & Error boundary states
  const [isLoading, setIsLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    setErrorBanner("");
    try {
      const allSessions = await api.getSessions();
      setSessions(allSessions);

      const allGoals = await api.getGoals();
      setGoals(allGoals);

      const calculatedStats = await api.getStats();
      setStats(calculatedStats);
    } catch (err: any) {
      console.error("Dashboard load data failure:", err);
      setErrorBanner(err.message || "An error occurred while loading data from Firestore.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateOrUpdateSession = async (sessionPayload: Omit<Session, "id"> & { id?: string }) => {
    try {
      if (sessionPayload.id) {
        await api.updateSession(sessionPayload.id, sessionPayload);
      } else {
        await api.createSession(sessionPayload);
      }
      setIsLogOpen(false);
      setSessionToEdit(null);
      await loadData(); // Reload statistics and lists
    } catch (err: any) {
      alert(`Failed to save session: ${err.message}`);
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await api.deleteSession(id);
      await loadData();
    } catch (err: any) {
      alert(`Failed to delete session: ${err.message}`);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalLift.trim() || !newGoalBaseline || !newGoalTarget || !newGoalDate) {
      alert("Please fill all goal fields.");
      return;
    }
    try {
      await api.createGoal({
        lift: newGoalLift,
        baselineWeight: Number(newGoalBaseline),
        targetWeight: Number(newGoalTarget),
        targetDate: newGoalDate,
      });
      setShowAddGoalForm(false);
      setNewGoalBaseline("");
      setNewGoalTarget("");
      await loadData();
    } catch (err: any) {
      alert(`Failed to add goal: ${err.message}`);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm("ARE YOU SURE YOU WANT TO REMOVE THIS FOCUS GOAL?")) {
      try {
        await api.deleteGoal(id);
        await loadData();
      } catch (err: any) {
        alert(`Failed to delete goal: ${err.message}`);
      }
    }
  };

  // Get distinct exercise names to feed autocomplete datalist
  const distinctLiftNames: string[] = Array.from(
    new Set(
      sessions
        .flatMap((s) => s.lifts || [])
        .map((l) => l.name)
        .filter(Boolean) as string[]
    )
  );

  // Filter sessions for the currently selected month
  const filteredSessions = sessions.filter((s) => s.date.startsWith(selectedMonth));

  // Determine current best weights for goal progress maps
  const currentBestWeights: { [liftName: string]: number } = {
    "Bench Press": stats?.liftStats?.bench?.bestWeight || 0,
    "Squat": stats?.liftStats?.squat?.bestWeight || 0,
    "Deadlift": stats?.liftStats?.deadlift?.bestWeight || 0,
  };

  // Months map translations
  const monthNamesShort: { [key: string]: string } = {
    "2026-01": "JAN",
    "2026-02": "FEB",
    "2026-03": "MAR",
    "2026-04": "APR",
    "2026-05": "MAY",
    "2026-06": "JUN",
    "2026-07": "JUL",
    "2026-08": "AUG",
    "2026-09": "SEP",
    "2026-10": "OCT",
    "2026-11": "NOV",
    "2026-12": "DEC",
  };

  const monthNames: { [key: string]: string } = {
    "2026-01": "JANUARY 2026",
    "2026-02": "FEBRUARY 2026",
    "2026-03": "MARCH 2026",
    "2026-04": "APRIL 2026",
    "2026-05": "MAY 2026",
    "2026-06": "JUNE 2026",
    "2026-07": "JULY 2026",
    "2026-08": "AUGUST 2026",
    "2026-09": "SEPTEMBER 2026",
    "2026-10": "OCTOBER 2026",
    "2026-11": "NOVEMBER 2026",
    "2026-12": "DECEMBER 2026",
  };

  const columnsList = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  // Compute stat row items for selected month
  const selectedMonthStats = stats?.monthlyStats?.[selectedMonth] || {
    trained: 0,
    skipped: 0,
    rest: 0,
    hitRate: 0,
  };

  const currentMonthBestBenchArray = filteredSessions
    .flatMap((s) => s.lifts || [])
    .filter((l) => l.name.toLowerCase().includes("bench"))
    .map((l) => l.workingWeight || 0);
  const currentMonthBestBench = currentMonthBestBenchArray.length > 0 ? Math.max(...currentMonthBestBenchArray) : 0;

  const currentMonthBestSquatArray = filteredSessions
    .flatMap((s) => s.lifts || [])
    .filter((l) => l.name.toLowerCase().includes("squat"))
    .map((l) => l.workingWeight || 0);
  const currentMonthBestSquat = currentMonthBestSquatArray.length > 0 ? Math.max(...currentMonthBestSquatArray) : 0;

  // Sort compare list chronological ascending
  const sortedMoMStats = [...(stats?.allMonthsCompare || [])].sort((a,b) => a.month.localeCompare(b.month));

  const correlationChartLabels = sortedMoMStats.map(m => monthNamesShort[m.month] || m.month);
  
  const themeChartColors: Record<string, { bench: string; squat: string; deadlift: string; text: string; grid: string; tooltipBg: string; tooltipBorder: string }> = {
    midnight: {
      bench: "#cbd5e1",
      squat: "#22d3ee",
      deadlift: "#ea580c",
      text: "#cbd5e1",
      grid: "rgba(32, 46, 58, 0.45)",
      tooltipBg: "#121921",
      tooltipBorder: "rgba(34, 211, 238, 0.3)",
    },
    monochrome: {
      bench: "#ffffff",
      squat: "#aaaaaa",
      deadlift: "#555555",
      text: "#f1f5f9",
      grid: "rgba(255, 255, 255, 0.08)",
      tooltipBg: "#0d0d0d",
      tooltipBorder: "rgba(255, 255, 255, 0.15)",
    },
    blood_iron: {
      bench: "#dc2626",
      squat: "#ef4444",
      deadlift: "#f87171",
      text: "#fca5a5",
      grid: "rgba(220, 38, 38, 0.15)",
      tooltipBg: "#1a0000",
      tooltipBorder: "rgba(220, 38, 38, 0.3)",
    },
    gold_standard: {
      bench: "#f59e0b",
      squat: "#fbbf24",
      deadlift: "#fcd34d",
      text: "#fde68a",
      grid: "rgba(245, 158, 11, 0.15)",
      tooltipBg: "#1a1400",
      tooltipBorder: "rgba(245, 158, 11, 0.3)",
    },
    matrix: {
      bench: "#22c55e",
      squat: "#4ade80",
      deadlift: "#86efac",
      text: "#dcfce7",
      grid: "rgba(34, 197, 94, 0.15)",
      tooltipBg: "#001400",
      tooltipBorder: "rgba(34, 197, 94, 0.3)",
    },
    neon_pump: {
      bench: "#e879f9",
      squat: "#a855f7",
      deadlift: "#06b6d4",
      text: "#fdf4ff",
      grid: "rgba(232, 121, 249, 0.15)",
      tooltipBg: "#1a0020",
      tooltipBorder: "rgba(232, 121, 249, 0.3)",
    },
    arctic: {
      bench: "#7dd3fc",
      squat: "#38bdf8",
      deadlift: "#e0f2fe",
      text: "#e0f2fe",
      grid: "rgba(125, 211, 252, 0.15)",
      tooltipBg: "#051a2e",
      tooltipBorder: "rgba(125, 211, 252, 0.3)",
    },
    carbon_fire: {
      bench: "#f97316",
      squat: "#fb923c",
      deadlift: "#fdba74",
      text: "#ffedd5",
      grid: "rgba(249, 115, 22, 0.15)",
      tooltipBg: "#111111",
      tooltipBorder: "rgba(249, 115, 22, 0.3)",
    },
    chalk: {
      bench: "#1a1a1a",
      squat: "#444444",
      deadlift: "#888888",
      text: "#1a1a1a",
      grid: "rgba(0, 0, 0, 0.12)",
      tooltipBg: "#f5f0e8",
      tooltipBorder: "rgba(0, 0, 0, 0.2)",
    },
  };

  const chartConfig = themeChartColors[theme] || themeChartColors.monochrome;

  const correlationChartData = {
    labels: correlationChartLabels.length > 0 ? correlationChartLabels : ["FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    datasets: [
      {
        label: "Best Bench Press (lbs)",
        data: sortedMoMStats.map(m => m.bestBench || 0),
        borderColor: chartConfig.bench,
        borderWidth: 2,
        pointBackgroundColor: chartConfig.bench,
        pointBorderColor: "#0a0a0a",
        pointHoverRadius: 6,
        tension: 0.35,
        fill: false,
      },
      {
        label: "Best Squat (lbs)",
        data: sortedMoMStats.map(m => m.bestSquat || 0),
        borderColor: chartConfig.squat,
        borderWidth: 2,
        pointBackgroundColor: chartConfig.squat,
        pointBorderColor: "#0a0a0a",
        pointHoverRadius: 6,
        tension: 0.35,
        fill: false,
      },
      {
        label: "Best Deadlift (lbs)",
        data: sortedMoMStats.map(m => m.bestDeadlift || 0),
        borderColor: chartConfig.deadlift,
        borderWidth: 2,
        pointBackgroundColor: chartConfig.deadlift,
        pointBorderColor: "#0a0a0a",
        pointHoverRadius: 6,
        tension: 0.35,
        fill: false,
      }
    ]
  };

  const correlationChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: chartConfig.text,
          font: {
            family: "Space Mono",
            size: 10,
          },
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: chartConfig.tooltipBg,
        borderColor: chartConfig.tooltipBorder,
        borderWidth: 1,
        titleColor: chartConfig.text,
        titleFont: {
          family: "Space Mono",
          size: 11,
          weight: "bold" as const,
        },
        bodyColor: chartConfig.text,
        bodyFont: {
          family: "Space Grotesk",
          size: 11,
        },
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          color: chartConfig.grid,
        },
        ticks: {
          color: chartConfig.text,
          font: {
            family: "Space Mono",
            size: 9,
          },
        },
      },
      y: {
        grid: {
          color: chartConfig.grid,
        },
        ticks: {
          color: chartConfig.text,
          font: {
            family: "Space Mono",
            size: 9,
          },
          callback: (value: any) => `${value} lb`,
        },
      }
    }
  };

  // Helper to query stats entry for each month securely
  const getMonthStats = (mKey: string) => {
    return stats?.allMonthsCompare?.find((x) => x.month === mKey) || {
      bestBench: null,
      bestSquat: null,
      bestDeadlift: null,
      sessionsCount: 0,
      skippedCount: 0,
      hitRate: 0
    };
  };

  const columnsKeys = [
    "2026-01", "2026-02", "2026-03", "2026-04",
    "2026-05", "2026-06", "2026-07", "2026-08",
    "2026-09", "2026-10", "2026-11", "2026-12"
  ];

  // Generator of Github contribution style heatmap for 2026
  const generateYearHeatmapData = () => {
    const year = 2026;
    const days: { dateStr: string; dayIndex: number; month: number; hasSession?: string; color: string }[] = [];
    
    const sessionByDate: { [date: string]: string } = {};
    sessions.forEach((s) => {
      sessionByDate[s.date] = s.type;
    });

    for (let i = 0; i < 365; i++) {
      const currentDate = new Date(year, 0, 1 + i);
      const y = currentDate.getFullYear();
      const m = String(currentDate.getMonth() + 1).padStart(2, "0");
      const d = String(currentDate.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;
      const dayIndex = currentDate.getDay(); // 0-6 (SUN-SAT)
      
      let colorClass = "bg-theme-unlogged-bg border border-theme-unlogged-border"; // default unlogged
      const sessType = sessionByDate[dateStr];
      if (sessType) {
        if (sessType === "trained") {
          colorClass = "bg-theme-trained-bg border border-theme-trained-border shadow-[0_0_6px_var(--theme-trained-shadow)]";
        } else if (sessType === "home") {
          colorClass = "bg-[var(--theme-home-bg)] border border-[var(--theme-home-border)]";
        } else if (sessType === "rest") {
          colorClass = "bg-theme-rest-bg border border-theme-rest-border";
        } else if (sessType === "skipped") {
          colorClass = "bg-theme-skip-bg border border-theme-skip-border";
        }
      }

      days.push({
        dateStr,
        dayIndex,
        month: currentDate.getMonth(),
        hasSession: sessType,
        color: colorClass
      });
    }
    return days;
  };

  const daysData = generateYearHeatmapData();
  const weeks: any[][] = [];
  let currentWeek: any[] = [];
  
  // Jan 1, 2026 is Thursday (Index 4) -> pad first SUN, MON, TUE, WED empty
  const firstDayIndex = new Date(2026, 0, 1).getDay();
  for (let b = 0; b < firstDayIndex; b++) {
    currentWeek.push({ isEmpty: true });
  }

  daysData.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ isEmpty: true });
    }
    weeks.push(currentWeek);
  }

  return (
    <div className="min-h-screen bg-transparent text-[#f1f5f9] flex flex-col font-sans transition-all pb-12 relative">
      {/* Top Navigation Frame Header */}
      <Header onLogout={onLogout} onOpenSettings={() => setShowSettings(true)} />

      {/* Month Selection Bar */}
      <MonthBar
        selectedMonth={selectedMonth}
        onChangeMonth={setSelectedMonth}
        monthlyStats={stats?.monthlyStats}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
        
        {/* Error Fallback Banner */}
        {errorBanner && (
          <div className="border border-red-500/20 bg-red-500/10 p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  DATABASE INITIALIZATION INCOMPLETE
                </h4>
                <p className="text-[11px] font-mono text-[#8ea2b5] mt-1 uppercase max-w-2xl">
                  {errorBanner}
                </p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-1.5 border border-red-500/30 hover:border-red-500 text-xs font-mono text-white transition-all cursor-pointer rounded-lg uppercase"
            >
              RETRIEVING DATA
            </button>
          </div>
        )}

        {/* Global Loading screen */}
        {isLoading ? (
          <div className="py-24 text-center space-y-3">
            <div className="h-4 w-4 bg-white mx-auto animate-spin shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
            <p className="text-xs font-mono text-[#aaaaaa] tracking-widest uppercase">
              COMPUTING REYES POWERLIFTING DATASETS...
            </p>
          </div>
        ) : (
          <>
            {/* Nav Tabs Bar */}
            <div className="flex border-b border-theme-border bg-theme-card/60 rounded-xl p-1 overflow-x-auto select-none backdrop-blur-md">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex-1 min-w-[100px] text-center py-2.5 text-xs font-mono font-bold tracking-widest cursor-pointer transition-all rounded-lg uppercase ${
                  activeTab === "dashboard"
                    ? "nav-tab-active"
                    : "text-theme-text-dim hover:text-[#ffffff] hover:bg-white/[0.03]"
                }`}
              >
                DASHBOARD
              </button>
              
              <button
                onClick={() => setActiveTab("sessions")}
                className={`flex-1 min-w-[100px] text-center py-2.5 text-xs font-mono font-bold tracking-widest cursor-pointer transition-all rounded-lg uppercase ${
                  activeTab === "sessions"
                    ? "nav-tab-active"
                    : "text-theme-text-dim hover:text-[#ffffff] hover:bg-white/[0.03]"
                }`}
              >
                SESSIONS
              </button>

              <button
                onClick={() => setActiveTab("consistency")}
                className={`flex-1 min-w-[100px] text-center py-2.5 text-xs font-mono font-bold tracking-widest cursor-pointer transition-all rounded-lg uppercase ${
                  activeTab === "consistency"
                    ? "nav-tab-active"
                    : "text-theme-text-dim hover:text-[#ffffff] hover:bg-white/[0.03]"
                }`}
              >
                CONSISTENCY
              </button>

              <button
                onClick={() => setActiveTab("compare")}
                className={`flex-1 min-w-[100px] text-center py-2.5 text-xs font-mono font-bold tracking-widest cursor-pointer transition-all rounded-lg uppercase ${
                  activeTab === "compare"
                    ? "nav-tab-active"
                    : "text-theme-text-dim hover:text-[#ffffff] hover:bg-white/[0.03]"
                }`}
              >
                COMPARE
              </button>
            </div>

            {/* Tab view layouts */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                
                {/* 1. Large Performance Correlation Line Chart Card (Spans full width) */}
                <div className="glass-card p-5 rounded-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-theme-border pb-3 mb-4 select-none">
                    <div>
                      <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-[#f8fafc] uppercase flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></span>
                        MONTH-OVER-MONTH PERFORMANCE CORRELATION
                      </h3>
                      <p className="text-[10px] font-sans text-[#aaaaaa] mt-1">
                        Comparing your training discipline trends vs your progress in key lifts.
                      </p>
                    </div>
                  </div>

                  <div className="h-[280px] w-full relative mb-6">
                    <Line data={correlationChartData} options={correlationChartOptions} />
                  </div>

                  {/* Summary Table under Chart */}
                  <div className="overflow-x-auto border border-theme-border rounded-lg">
                    <table className="w-full text-left font-mono border-collapse divide-y divide-theme-border text-[10px]">
                      <thead className="bg-black/40 text-[#aaaaaa] font-bold">
                        <tr>
                          <th className="px-3 py-2 border-r border-theme-border select-none">Performance Rating</th>
                          {columnsList.map((col, idx) => (
                            <th key={idx} className="px-2 py-2 text-center border-r border-theme-border select-none">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-theme-border text-white">
                        <tr className="hover:bg-white/5">
                          <td className="px-3 py-2 border-r border-theme-border text-[#ffffff] font-sans font-medium text-xs">Best Bench Press (lbs)</td>
                          {columnsKeys.map((k, idx) => {
                            const val = getMonthStats(k).bestBench;
                            return <td key={idx} className="px-2 py-2 text-center border-r border-theme-border">{val ? `${val}` : "—"}</td>;
                          })}
                        </tr>
                        <tr className="hover:bg-white/5">
                          <td className="px-3 py-2 border-r border-theme-border text-[#ffffff] font-sans font-medium text-xs">Best Squat (lbs)</td>
                          {columnsKeys.map((k, idx) => {
                            const val = getMonthStats(k).bestSquat;
                            return <td key={idx} className="px-2 py-2 text-center border-r border-theme-border text-white font-bold">{val ? `${val}` : "—"}</td>;
                          })}
                        </tr>
                        <tr className="hover:bg-white/5">
                          <td className="px-3 py-2 border-r border-theme-border text-[#ffffff] font-sans font-medium text-xs">Best Deadlift (lbs)</td>
                          {columnsKeys.map((k, idx) => {
                            const val = getMonthStats(k).bestDeadlift;
                            return <td key={idx} className="px-2 py-2 text-center border-r border-theme-border text-[#aaaaaa] font-bold">{val ? `${val}` : "—"}</td>;
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Three Columns Middle section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
                  
                  {/* Column 1: Monthly Summary Card (4 columns) */}
                  <div className="glass-card md:col-span-4 p-5 rounded-xl flex flex-col justify-between min-h-[220px]">
                    <div className="flex items-center gap-2 border-b border-theme-border pb-2 mb-3">
                      <Activity size={13} className="text-white" />
                      <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#aaaaaa] uppercase">
                        MONTHLY SUMMARY
                      </span>
                    </div>
                    <div className="space-y-3 my-auto py-1">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5 text-xs">
                        <span className="text-[#aaaaaa] font-mono">MONTHLY SESSIONS</span>
                        <span className="text-white font-mono font-bold">{selectedMonthStats.trained} SESS</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5 text-xs">
                        <span className="text-[#aaaaaa] font-mono">RELIABILITY (MONTH)</span>
                        <span className="text-white font-mono font-bold">{selectedMonthStats.hitRate}%</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5 text-xs">
                        <span className="text-[#aaaaaa] font-mono">CURRENT SQUAT (MAX)</span>
                        <span className="text-white font-mono font-bold">
                          {currentMonthBestSquat > 0 ? `${currentMonthBestSquat} LB` : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5 text-xs">
                        <span className="text-[#aaaaaa] font-mono">CURRENT BENCH (MAX)</span>
                        <span className="text-white font-mono font-bold">
                          {currentMonthBestBench > 0 ? `${currentMonthBestBench} LB` : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5 text-xs">
                        <span className="text-[#cccccc] font-mono flex items-center gap-1">CURRENT STREAK <Flame size={12} className="animate-pulse" /></span>
                        <span className="text-white font-mono font-bold">{stats?.streaks?.currentStreak || 0} DAYS</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-[#666666] uppercase tracking-wider block text-center mt-2 select-none">
                      DYNAMIC ACCOUNT STATS
                    </span>
                  </div>

                  {/* Column 2: Goal Tracking Progress Card (4 columns) */}
                  <div className="glass-card md:col-span-4 p-5 rounded-xl flex flex-col justify-between min-h-[220px]">
                    <div className="flex items-center justify-between border-b border-theme-border pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Target size={13} className="text-white" />
                        <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#aaaaaa] uppercase">
                          GOAL TRACKING PROGRESS
                        </span>
                      </div>
                      <button
                        onClick={() => setShowAddGoalForm(!showAddGoalForm)}
                        className="text-[9px] font-mono tracking-wider px-2 py-0.5 border border-theme-accent/30 text-theme-accent rounded hover:border-theme-accent hover:bg-white/5 cursor-pointer"
                      >
                        + ADD
                      </button>
                    </div>

                    <div className="flex-1 my-auto overflow-x-auto min-h-[148px]">
                      {goals.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-center py-6 text-xs font-mono text-[#5c7285] uppercase">
                          NO ACTIVE FOCUS GOALS
                        </div>
                      ) : (
                        <table className="w-full text-[10px] font-mono text-left">
                          <thead>
                            <tr className="text-[#666666] border-b border-theme-border pb-1 uppercase">
                              <th className="py-1">LIFT TYPE</th>
                              <th className="py-1 text-center">START</th>
                              <th className="py-1 text-center">GOAL</th>
                              <th className="py-1 text-right">PROGRESS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-theme-border text-white">
                            {goals.map((g) => {
                              const current = currentBestWeights[g.lift] || 0;
                              const baseline = g.baselineWeight;
                              const target = g.targetWeight;
                              let percent = 0;
                              const range = target - baseline;
                              if (range > 0) percent = Math.min(100, Math.max(0, ((current - baseline) / range) * 100));
                              else if (current >= target) percent = 100;

                              return (
                                <tr key={g.id} className="hover:bg-white/5 transition-colors">
                                  <td className="py-2 font-sans font-bold text-white uppercase truncate max-w-[80px]">
                                    {g.lift}
                                  </td>
                                  <td className="py-2 text-center text-[#cbd5e1]">{baseline} lb</td>
                                  <td className="py-2 text-center text-white font-bold">{target} lb</td>
                                  <td className="py-2 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <span className="text-white font-bold">{Math.round(percent)}%</span>
                                      <div className="w-10 h-1.5 rounded overflow-hidden" style={{ backgroundColor: "var(--theme-goal-bar-bg, #000000)" }}>
                                        <div className="h-full" style={{ width: `${percent}%`, backgroundColor: "var(--theme-goal-bar-fill, #ffffff)", boxShadow: "var(--theme-goal-shadow)" }}></div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>

                    <div className="border-t border-theme-border pt-2.5 mt-2 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-[#cbd5e1] uppercase">CURRENT STREAK:</span>
                      <span className="text-xs font-mono font-black text-white tracking-widest">{stats?.streaks?.currentStreak || 0} DAYS</span>
                    </div>
                  </div>

                  {/* Column 3: Month-over-month mini table (4 columns) */}
                  <div className="glass-card md:col-span-4 p-5 rounded-xl flex flex-col justify-between min-h-[220px]">
                    <div className="flex items-center gap-2 border-b border-theme-border pb-2 mb-2">
                      <Layers size={13} className="text-white" />
                      <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#aaaaaa] uppercase">
                        MONTH-OVER-MONTH STATS
                      </span>
                    </div>

                    <div className="flex-1 overflow-auto max-h-[160px] pr-1">
                      <table className="w-full text-[9px] font-mono border-collapse text-left">
                        <thead>
                          <tr className="text-[#666666] border-b border-theme-border pb-1 uppercase">
                            <th className="py-1">MONTH</th>
                            <th className="py-1 text-center">SESS</th>
                            <th className="py-1 text-center">OK</th>
                            <th className="py-1 text-center">PCT</th>
                            <th className="py-1 text-center text-[#cbd5e1]">BENCH</th>
                            <th className="py-1 text-center text-[#cbd5e1]">SQUAT</th>
                            <th className="py-1 text-right text-[#cbd5e1]">DEAD</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-theme-border text-white">
                          {sortedMoMStats.map(m => {
                            const label = monthNamesShort[m.month] || m.month;
                            return (
                              <tr key={m.month} className="hover:bg-white/5 transition-colors">
                                <td className="py-1.5 font-bold">{label}</td>
                                <td className="py-1.5 text-center text-[#aaaaaa]">{m.sessionsCount}</td>
                                <td className="py-1.5 text-center text-[#aaaaaa]">{m.sessionsCount}</td>
                                <td className="py-1.5 text-center text-white font-bold">{m.hitRate}%</td>
                                <td className="py-1.5 text-center font-bold">{m.bestBench || "—"}</td>
                                <td className="py-1.5 text-center font-bold text-white">{m.bestSquat || "—"}</td>
                                <td className="py-1.5 text-right font-bold text-[#aaaaaa]">{m.bestDeadlift || "—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <span className="text-[8px] font-mono text-[#5c7285] uppercase tracking-wider block text-center mt-2 select-none">
                      UTC YEAR FULL 2026 LOGS
                    </span>
                  </div>

                  {/* Add goal inline form wrapper */}
                  {showAddGoalForm && (
                     <div className="glass-card md:col-span-12 p-5 rounded-xl animate-fadeIn space-y-3.5">
                      <h4 className="text-[10px] font-mono tracking-widest text-white uppercase border-b border-theme-border pb-2 font-bold select-none">
                        LOG NEW FOCUS GOAL
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-[#aaaaaa] uppercase tracking-wider block">
                            Exercise target
                          </label>
                          <select
                            value={newGoalLift}
                            onChange={(e) => setNewGoalLift(e.target.value)}
                            className="w-full bg-[#141414]/90 border border-theme-border p-2 text-xs text-white outline-none font-mono rounded"
                          >
                            <option value="Bench Press">Bench Press</option>
                            <option value="Squat">Squat</option>
                            <option value="Deadlift">Deadlift</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-[#aaaaaa] uppercase tracking-wider block">
                            Baseline weight
                          </label>
                          <input
                            type="number"
                            placeholder="e.g. 135"
                            value={newGoalBaseline}
                            onChange={(e) => setNewGoalBaseline(e.target.value)}
                            className="w-full bg-[#141414] border border-white/10 p-2 text-xs font-mono text-white outline-none rounded"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-[#aaaaaa] uppercase tracking-wider block">
                            Target weight
                          </label>
                          <input
                            type="number"
                            placeholder="e.g. 225"
                            value={newGoalTarget}
                            onChange={(e) => setNewGoalTarget(e.target.value)}
                            className="w-full bg-[#141414] border border-white/10 p-2 text-xs font-mono text-white outline-none rounded"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-[#aaaaaa] uppercase tracking-wider block">
                            Target achievement date
                          </label>
                          <input
                            type="date"
                            value={newGoalDate}
                            onChange={(e) => setNewGoalDate(e.target.value)}
                            className="w-full bg-[#141414] border border-white/10 p-2 text-xs font-mono text-white outline-none rounded"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2.5 pt-2 border-t border-white/10 divide-x divide-white/10">
                        <button
                          type="button"
                          onClick={() => setShowAddGoalForm(false)}
                          className="flex-1 text-[10px] font-mono text-[#aaaaaa] hover:text-white uppercase py-1.5 cursor-pointer"
                        >
                          CANCEL
                        </button>
                        
                        <button
                          onClick={handleCreateGoal}
                          className="flex-1 text-[10px] font-mono text-white font-bold hover:underline uppercase py-1.5 cursor-pointer"
                        >
                          SUBMIT GOAL
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Lifetime PR Highlights overflow drawer if any */}
                  {stats?.prHistory && stats.prHistory.length > 0 && (
                    <div className="glass-card p-5 md:col-span-12 rounded-xl select-none">
                      <div className="text-[10px] font-mono tracking-[0.2em] text-[#aaaaaa] uppercase border-b border-theme-border pb-2 mb-3 select-none flex items-center gap-1.5">
                        <Trophy size={12} className="text-white" />
                        ALL HISTORICAL RECORD BREAKS ({stats.prHistory.length})
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {stats.prHistory.map((pr, idx) => (
                          <div key={idx} className="bg-[#0a0f15]/75 border border-theme-border p-2.5 flex items-center justify-between text-xs rounded-lg hover:border-theme-border-hover transition-all duration-300">
                            <div>
                              <span className="font-bold text-white uppercase block text-[10px] truncate">{pr.lift}</span>
                              <span className="text-[8px] font-mono text-[#5c7285] block">{pr.date}</span>
                            </div>
                            <span className="font-mono text-white text-[11px] font-bold bg-[#1e1e1e] px-1.5 stroke-black py-0.5 border border-theme-border rounded">
                              {pr.weight} lb
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* 3. Consistency & Exercise Heatmap section (at bottom) */}
                <div className="glass-card p-6 rounded-xl">
                  <div className="border-b border-theme-border pb-3 mb-5 select-none flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse"></span>
                    <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-[#f8fafc] uppercase">
                      CONSISTENCY & EXERCISE HEATMAP - {selectedMonth}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Left: 4 stat boxes */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-3 shrink-0">
                      <div className="bg-[#0a0f15]/75 border border-theme-border p-3.5 rounded-lg">
                        <span className="text-[8px] font-mono text-[#aaaaaa] uppercase tracking-wider block">TRACKED DAYS</span>
                        <div className="text-sm font-mono font-black text-white mt-1 uppercase">{selectedMonthStats.trained} DAYS</div>
                      </div>
                      <div className="bg-[#0a0f15]/75 border border-theme-border p-3.5 rounded-lg">
                        <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider block">SKIPPED DAYS</span>
                        <div className="text-sm font-mono font-black text-neutral-300 mt-1 uppercase">{selectedMonthStats.skipped} DAYS</div>
                      </div>
                      <div className="bg-[#0a0f15]/75 border border-theme-border p-3.5 rounded-lg">
                        <span className="text-[8px] font-mono text-[#cbd5e1] uppercase tracking-wider block">REST DAYS</span>
                        <div className="text-sm font-mono font-black text-neutral-400 mt-1 uppercase">{selectedMonthStats.rest} DAYS</div>
                      </div>
                      <div className="bg-[#0a0f15]/75 border border-theme-border p-3.5 rounded-lg">
                        <span className="text-[8px] font-mono text-white uppercase tracking-wider block">MONTHLY PCT RATE</span>
                        <div className="text-sm font-mono font-black text-white mt-1 uppercase">{selectedMonthStats.hitRate}%</div>
                      </div>
                    </div>

                    {/* Right: Year-wide contribution matrix */}
                    <div className="lg:col-span-8 flex flex-col justify-center">
                      <div className="flex justify-between text-[8px] font-mono text-[#5c7285] pr-2 pb-1.5 select-none uppercase">
                        <span>JAN</span>
                        <span>FEB</span>
                        <span>MAR</span>
                        <span>APR</span>
                        <span>MAY</span>
                        <span>JUN</span>
                        <span>JUL</span>
                        <span>AUG</span>
                        <span>SEP</span>
                        <span>OCT</span>
                        <span>NOV</span>
                        <span>DEC</span>
                      </div>
                             {/* GitHub Contributions board scrollable layout */}
                      <div className="overflow-x-auto border border-theme-border p-3 bg-black/45 rounded-lg">
                        <div className="flex gap-[3.5px] min-w-[530px]">
                          {weeks.map((week, wIdx) => (
                            <div key={wIdx} className="flex flex-col gap-[3.5px] shrink-0">
                              {week.map((day, dIdx) => (
                                <div
                                  key={dIdx}
                                  title={day.isEmpty ? "" : `${day.dateStr}${day.hasSession ? ` - ${day.hasSession.toUpperCase()}` : " - UNLOGGED"}`}
                                  className={`w-[9px] h-[9px] sm:w-[10px] sm:h-[10px] rounded-[1.5px] border ${
                                    day.isEmpty ? "bg-transparent border-transparent" : day.color
                                  } transition-colors duration-200`}
                                />
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Micro Legend labels */}
                      <div className="flex justify-end gap-3 mt-2 text-[8px] font-mono text-[#5c7285] select-none uppercase">
                        <div className="flex items-center gap-1">
                          <div className="w-[8px] h-[8px] bg-theme-unlogged-bg border border-theme-unlogged-border rounded-[1px]" />
                          <span>UNLOGGED</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-[8px] h-[8px] bg-theme-rest-bg border border-theme-rest-border rounded-[1px]" />
                          <span>REST</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-[8px] h-[8px] bg-theme-skip-bg border border-theme-skip-border rounded-[1px]" />
                          <span>SKIP</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-[8px] h-[8px] bg-theme-trained-bg border border-theme-trained-border rounded-[1px]" />
                          <span>TRAINED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === "sessions" && (
              <SessionsView
                sessions={filteredSessions}
                onAddSession={() => {
                  setSessionToEdit(null);
                  setIsLogOpen(true);
                }}
                onEditSession={(sess) => {
                  setSessionToEdit(sess);
                  setIsLogOpen(true);
                }}
                onDeleteSession={handleDeleteSession}
                selectedMonthLabel={monthNames[selectedMonth]}
              />
            )}

            {activeTab === "consistency" && (
              <ConsistencyView
                selectedMonth={selectedMonth}
                sessions={sessions}
                monthlyStatsMap={stats?.monthlyStats}
              />
            )}

            {activeTab === "compare" && (
              <CompareView allMonthsCompare={stats?.allMonthsCompare || []} />
            )}
          </>
        )}
      </main>

      {/* Log Workout session modal */}
      <LogModal
        isOpen={isLogOpen}
        onClose={() => {
          setIsLogOpen(false);
          setSessionToEdit(null);
        }}
        onSave={handleCreateOrUpdateSession}
        sessionToEdit={sessionToEdit}
        existingLiftNames={distinctLiftNames}
      />

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          theme={theme}
          onThemeChange={setTheme}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
