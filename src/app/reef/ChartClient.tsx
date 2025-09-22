"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function ChartClient({ labels, values }: { labels: (string|number)[]; values: number[] }) {
  const data = {
    labels,
    datasets: [
      {
        label: "健康指数",
        data: values,
        borderColor: "rgb(34,211,238)",
        backgroundColor: "rgba(34,211,238,0.2)",
        tension: 0.25,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#e2e8f0" } },
      tooltip: { intersect: false, mode: "index" as const },
    },
    scales: {
      x: { ticks: { color: "#94a3b8" }, grid: { color: "#0f172a" } },
      y: { ticks: { color: "#94a3b8" }, grid: { color: "#0f172a" } },
    },
  } as const;
  return <Line data={data} options={options} />;
}


