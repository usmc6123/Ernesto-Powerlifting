import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { BarChart3 } from "lucide-react";
import { MonthlyStats } from "../types";

// Register Chart.js elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface CompareProps {
  allMonthsCompare: MonthlyStats[];
}

export default function Compare({ allMonthsCompare }: CompareProps) {
  // Sort compare list chronological ascending
  const sortedCompare = [...allMonthsCompare].sort((a, b) => a.month.localeCompare(b.month));

  const monthNames: { [key: string]: string } = {
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

  const chartLabels = sortedCompare.map((m) => monthNames[m.month] || m.month);
  
  // Weights over months
  const benchData = sortedCompare.map((m) => m.bestBench || 0);
  const squatData = sortedCompare.map((m) => m.bestSquat || 0);
  const deadliftData = sortedCompare.map((m) => m.bestDeadlift || 0);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "Best Bench Press (lbs)",
        data: benchData,
        backgroundColor: "rgba(255, 255, 255, 0.8)", // white accent
        borderColor: "#ffffff",
        borderWidth: 1.5,
      },
      {
        label: "Best Squat (lbs)",
        data: squatData,
        backgroundColor: "rgba(170, 170, 170, 0.8)", // light gray
        borderColor: "#aaaaaa",
        borderWidth: 1.5,
      },
      {
        label: "Best Deadlift (lbs)",
        data: deadliftData,
        backgroundColor: "rgba(85, 85, 85, 0.8)", // dark gray
        borderColor: "#555555",
        borderWidth: 1.5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#cbd5e1",
          font: {
            family: "JetBrains Mono, monospace",
            size: 10,
          },
        },
      },
      tooltip: {
        backgroundColor: "#0d0d0d",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        titleColor: "#ffffff",
        titleFont: {
          family: "JetBrains Mono, monospace",
          size: 11,
          weight: "bold" as const,
        },
        bodyColor: "#f1f5f9",
        bodyFont: {
          family: "JetBrains Mono, monospace",
          size: 11,
        },
        borderRadius: 8,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#aaaaaa",
          font: {
            family: "JetBrains Mono, monospace",
            size: 9,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#aaaaaa",
          font: {
            family: "JetBrains Mono, monospace",
            size: 9,
          },
          callback: (value: any) => `${value} lb`,
        },
        title: {
          display: true,
          text: "WEIGHT PROGRESSION",
          color: "#cbd5e1",
          font: {
            family: "JetBrains Mono, monospace",
            size: 9,
            weight: "bold" as const,
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] select-none">
        <h2 className="text-xs font-mono font-bold tracking-[0.2em] text-white uppercase flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
          MONTH-OVER-MONTH PERFORMANCE COMPARISON
        </h2>
        <p className="text-[10px] font-sans text-[#aaaaaa] mt-1">
          Compare your best lift execution weights and volumetric consistency rates sorted by month.
        </p>
      </div>

      {/* Bar Chart comparing best outputs */}
      <div className="border border-white/10 bg-white/[0.04] backdrop-blur-md p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:border-white/20 transition-[border-color] duration-300">
        <span className="text-[10px] font-mono tracking-widest text-white font-bold block mb-4 select-none">
          BEST LIFTS COMPENSATOR CHART (BENCH VS SQUAT VS DEADLIFT)
        </span>
        <div className="h-[280px] w-full relative">
          <Bar data={data} options={options} />
        </div>
      </div>

      {/* MoM Performance Summary Table */}
      <div className="border border-white/10 bg-white/[0.04] backdrop-blur-md rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono border-collapse divide-y divide-white/10">
            {/* Table Header */}
            <thead className="bg-[#141414] text-[9px] font-bold tracking-[0.2em] text-[#aaaaaa]">
              <tr>
                <th className="px-4 py-3 border-r border-white/10 uppercase">MONTH</th>
                <th className="px-4 py-3 border-r border-white/10 text-center uppercase">TRAINED</th>
                <th className="px-4 py-3 border-r border-white/10 text-center uppercase">SKIPPED</th>
                <th className="px-4 py-3 border-r border-white/10 text-center uppercase">HIT RATE</th>
                <th className="px-4 py-3 border-r border-white/10 text-center uppercase text-white">BEST BENCH</th>
                <th className="px-4 py-3 border-r border-white/10 text-center uppercase text-[#aaaaaa]">BEST SQUAT</th>
                <th className="px-4 py-3 text-center uppercase text-[#555555]">BEST DEADLIFT</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-white/10 text-[11px] text-[#f1f5f9]">
              {sortedCompare.map((row) => {
                const label = monthNames[row.month] || row.month;
                return (
                  <tr key={row.month} className="hover:bg-white/[0.02] transition-colors">
                    {/* Month Label */}
                    <td className="px-4 py-3 border-r border-white/10 text-[#cbd5e1] font-bold">
                      {label} 2026
                    </td>
                    
                    {/* Trained Sessions Count */}
                    <td className="px-4 py-3 border-r border-white/10 text-center text-[#aaaaaa]">
                      {row.sessionsCount} SESS
                    </td>

                    {/* Skipped count */}
                    <td className="px-4 py-3 border-r border-white/10 text-center text-[#aaaaaa]">
                      {row.skippedCount} DAYS
                    </td>

                    {/* Hit Rate percentage */}
                    <td className="px-4 py-3 border-r border-white/10 text-center text-[#cbd5e1] font-black font-mono">
                      {row.hitRate}%
                    </td>

                    {/* Best Bench */}
                    <td className="px-4 py-3 border border-white/10 text-center font-bold text-white">
                      {row.bestBench ? `${row.bestBench} lb` : "—"}
                    </td>

                    {/* Best Squat */}
                    <td className="px-4 py-3 border border-white/10 text-center font-bold text-[#aaaaaa]">
                      {row.bestSquat ? `${row.bestSquat} lb` : "—"}
                    </td>

                    {/* Best Deadlift */}
                    <td className="px-4 py-3 text-center font-bold text-[#555555]">
                      {row.bestDeadlift ? `${row.bestDeadlift} lb` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
