import { useEffect, useRef } from "react";
import { Chart, DoughnutController, ArcElement, Tooltip } from "chart.js";

Chart.register(DoughnutController, ArcElement, Tooltip);

export const sentimentColors = { positive: "#1f5c3f", neutral: "#c9a56a", negative: "#b5483a" };

/** Doughnut chart of positive / neutral / negative comments. */
export default function SentimentDoughnut({ positive, neutral, negative, ariaLabel, children }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: ["Positive", "Neutral", "Negative"],
        datasets: [
          {
            data: [positive, neutral, negative],
            backgroundColor: [sentimentColors.positive, sentimentColors.neutral, sentimentColors.negative],
            borderWidth: 2,
            borderColor: "#ffffff",
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: { legend: { display: false } },
      },
    });
    return () => chart.destroy();
  }, [positive, neutral, negative]);

  return (
    <div className="donut">
      <canvas ref={canvasRef} role="img" aria-label={ariaLabel} />
      <div className="donut__center">{children}</div>
    </div>
  );
}
