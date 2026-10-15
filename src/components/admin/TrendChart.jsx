import { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from "chart.js";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

/** Line chart of the average overall rating per day. */
export default function TrendChart({ labels, values, counts, ariaLabel }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !values.length) return;
    const ctx = canvasRef.current.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, "rgba(31, 92, 63, 0.28)");
    gradient.addColorStop(1, "rgba(31, 92, 63, 0)");

    const min = Math.max(1, Math.floor(Math.min(...values) * 2) / 2 - 0.5);

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderColor: "#1f5c3f",
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: values.length <= 10 ? 3 : 0,
            pointHoverRadius: 5,
            pointBackgroundColor: "#ffffff",
            pointBorderColor: "#1f5c3f",
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => `${c.parsed.y.toFixed(1)} avg · ${counts?.[c.dataIndex] ?? 0} responses`,
            },
          },
        },
        scales: {
          y: { display: false, min, max: 5 },
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { maxTicksLimit: 7, color: "#5b685f", maxRotation: 0 },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [labels, values, counts]);

  return (
    <div className="chart-box chart-box--trend">
      <canvas ref={canvasRef} role="img" aria-label={ariaLabel} />
    </div>
  );
}
