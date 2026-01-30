"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

/* -------------------- Type -------------------- */
interface DayWiseScore {
  day: number;
  score: number;
  total_questions: number;
}

/* -------------------- Component -------------------- */
export default function DayPerformanceBar({
  data,
}: {
  data: DayWiseScore[];
}) {
  if (!data || data.length === 0) return null;

  // Compute percentage for each day
  const percentages = data.map((d) =>
    d.total_questions > 0 ? Math.round((d.score / d.total_questions) * 100) : 0
  );

  // Labels for X-axis
  const labels = data.map((d) => `D${d.day}`);

  // Chart.js data object
  const chartData = {
    labels,
    datasets: [
      {
        label: "Performance (%)",
        data: percentages,
        backgroundColor: percentages.map((p) =>
          p >= 80 ? "#22c55e" : p >= 50 ? "#facc15" : "#ef4444"
        ), // Green / Yellow / Red
        borderRadius: 6, // rounded bars
        barThickness: 30, // width of bars
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // 🔥 important: allows custom height
    plugins: {
      legend: { display: false }, // hide legend
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `Score: ${data[context.dataIndex].score}/${data[context.dataIndex].total_questions}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // percentage scale
        ticks: { stepSize: 20 },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    // Parent container must have height for chart to show
    <div className="w-full h-48 mt-4">
      <Bar data={chartData} options={options} />
    </div>
  );
}
