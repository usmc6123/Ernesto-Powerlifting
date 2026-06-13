import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { formatDateString } from "../lib/utils";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

interface ProgressionPoint {
  date: string;
  workingWeight: number;
  totalReps: number;
  estimated1RM: number;
}

interface ProgressChartProps {
  title: string;
  progression: ProgressionPoint[];
}

export default function ProgressChart({ title, progression }: ProgressChartProps) {
  // Sort chronological ascending
  const sortedProg = [...progression].sort((a, b) => a.date.localeCompare(b.date));

  const labels = sortedProg.map((p) => {
    // e.g. "2026-01-05" -> "JAN 5"
    const parts = p.date.split("-");
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return monthIdx >= 0 && monthIdx < 12 ? `${months[monthIdx]} ${day}` : p.date;
  });

  const weightData = sortedProg.map((p) => p.workingWeight);
  const repsData = sortedProg.map((p) => p.totalReps);

  const data = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: "Working Weight (lbs)",
        data: weightData,
        borderColor: "#ffffff",
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#111111",
        pointHoverBackgroundColor: "#ffffff",
        pointHoverRadius: 6,
        yAxisID: "y-weight",
        tension: 0.1,
      },
      {
        type: "bar" as const,
        label: "Total Reps",
        data: repsData,
        backgroundColor: "#2a2a2a",
        borderColor: "#2f2f2f",
        borderWidth: 1,
        yAxisID: "y-reps",
        barThickness: 16,
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
          color: "#cccccc",
          font: {
            family: "Space Mono",
            size: 10,
          },
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: "#111111",
        borderColor: "#2f2f2f",
        borderWidth: 1,
        titleColor: "#ffffff",
        titleFont: {
          family: "Space Mono",
          size: 11,
          weight: "bold" as const,
        },
        bodyColor: "#cccccc",
        bodyFont: {
          family: "Space Sans",
          size: 11,
        },
        cornerRadius: 0,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          color: "#1a1a1a",
        },
        ticks: {
          color: "#555555",
          font: {
            family: "Space Mono",
            size: 9,
          },
        },
      },
      "y-weight": {
        type: "linear" as const,
        position: "left" as const,
        grid: {
          color: "#1a1a1a",
        },
        ticks: {
          color: "#cccccc",
          font: {
            family: "Space Mono",
            size: 9,
          },
          callback: (value: any) => `${value} lb`,
        },
        title: {
          display: true,
          text: "WEIGHT",
          color: "#888888",
          font: {
            family: "Space Mono",
            size: 9,
            weight: "bold" as const,
          },
        },
      },
      "y-reps": {
        type: "linear" as const,
        position: "right" as const,
        grid: {
          drawOnChartArea: false, // Prevents dual gridlines chaos
        },
        ticks: {
          color: "#888888",
          font: {
            family: "Space Mono",
            size: 9,
          },
        },
        title: {
          display: true,
          text: "TOTAL REPS",
          color: "#888888",
          font: {
            family: "Space Mono",
            size: 9,
            weight: "bold" as const,
          },
        },
      },
    },
  };

  return (
    <div className="border border-white/10 bg-white/[0.04] backdrop-blur-md p-4 w-full flex flex-col h-[300px] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
      <div className="text-[10px] font-mono tracking-[0.2em] text-[#888888] mb-3 uppercase select-none">
        {title.toUpperCase()} PROGRESSION CHART
      </div>
      <div className="flex-1 w-full h-full relative">
        {progression.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-[#555555]">
            NO HISTORIC TRAINING DATA POINTS FOUND
          </div>
        ) : (
          <Chart type="bar" data={data} options={options} />
        )}
      </div>
    </div>
  );
}
