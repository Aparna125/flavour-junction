import { useEffect, useRef } from "react";
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip } from "chart.js";

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip);

/**
 * Horizontal bar chart with the value printed at the end of each bar.
 * `format` should be a stable (module-level) function, and `labels`, `values`
 * and `colors` should be memoised, otherwise the chart is rebuilt on every render.
 */
export default function HorizontalBarChart({ labels, values, colors, max, format, ariaLabel, rowHeight = 44 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const valueLabels = {
      id: "valueLabels",
      afterDatasetsDraw(chart) {
        const { ctx } = chart;
        ctx.save();
        ctx.font = "600 13px Inter, system-ui, sans-serif";
        ctx.fillStyle = "#1b2a21";
        ctx.textBaseline = "middle";
        chart.getDatasetMeta(0).data.forEach((bar, i) => {
          ctx.fillText(format(chart.data.datasets[0].data[i]), bar.x + 8, bar.y);
        });
        ctx.restore();
      },
    };

    const chart = new Chart(canvasRef.current.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [{ data: values, backgroundColor: colors, borderRadius: 6, borderSkipped: false, barThickness: 14 }],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 52 } },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => format(c.parsed.x) } },
        },
        scales: {
          x: { display: false, min: 0, max },
          y: { grid: { display: false }, border: { display: false }, ticks: { color: "#1b2a21", font: { size: 13 } } },
        },
      },
      plugins: [valueLabels],
    });

    return () => chart.destroy();
  }, [labels, values, colors, max, format]);

  return (
    <div className="hbar" style={{ height: labels.length * rowHeight + 8 }}>
      <canvas ref={canvasRef} role="img" aria-label={ariaLabel} />
    </div>
  );
}
