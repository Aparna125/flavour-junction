// SAMPLE DATA for designing the Analytics page before the backend exists.
// Used only when VITE_USE_SAMPLE_DATA=true. Illustrative figures, not real guest data.
const DAY = 24 * 60 * 60 * 1000;
const seeded = (i) => Math.sin(i * 12.9898) * 0.5 + 0.5;
const round1 = (n) => Math.round(n * 10) / 10;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
// "16–22 Sep" when both days are in the same month, otherwise "28 Sep–4 Oct"
const fmtRange = (a, b) =>
  a.getMonth() === b.getMonth() ? `${a.getDate()}–${b.getDate()} ${MONTHS[b.getMonth()]}` : `${fmt(a)}–${fmt(b)}`;

const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function getSampleAnalytics({ range = "30", from, to }) {
  const end = range === "custom" && to ? new Date(`${to}T12:00:00`) : new Date();
  const days =
    range === "custom" && from && to
      ? Math.max(1, Math.round((new Date(`${to}T12:00:00`) - new Date(`${from}T12:00:00`)) / DAY) + 1)
      : Number(range);
  const start = new Date(end.getTime() - (days - 1) * DAY);

  const total = Math.max(5, Math.round(days * 41.6));
  const positive = Math.round(total * 0.88);
  const negative = Math.round(total * 0.04);
  const neutral = total - positive - negative;

  const shares = { 4: 0.168, 3: 0.054, 2: 0.026, 1: 0.014 };
  const ratingDistribution = Object.fromEntries(Object.entries(shares).map(([k, v]) => [k, Math.round(total * v)]));
  ratingDistribution[5] = total - Object.values(ratingDistribution).reduce((a, b) => a + b, 0);

  // One value per day, then grouped (daily for short ranges, weekly for longer ones).
  const daily = Array.from({ length: days }, (_, i) => {
    const progress = days > 1 ? i / (days - 1) : 1;
    return {
      date: new Date(start.getTime() + i * DAY),
      average: Math.min(5, Math.max(1, 4.2 + 0.5 * progress + (seeded(i) - 0.5) * 0.2)),
      count: Math.max(1, Math.round((total / days) * (0.7 + seeded(i + 50) * 0.6))),
    };
  });

  let trend;
  if (days <= 14) {
    trend = daily.map((d) => ({
      label: days <= 7 ? d.date.toLocaleDateString("en-GB", { weekday: "short" }) : fmt(d.date),
      average: round1(d.average),
      count: d.count,
    }));
  } else {
    trend = [];
    for (let i = 0; i < daily.length; i += 7) {
      const group = daily.slice(i, i + 7);
      const n = group.reduce((s, g) => s + g.count, 0);
      const avg = group.reduce((s, g) => s + g.average * g.count, 0) / n;
      trend.push({ label: fmtRange(group[0].date, group[group.length - 1].date), average: round1(avg), count: n });
    }
  }

  const prevTotal = Math.round(total / 1.12);
  return {
    isSample: true,
    period: { from: toISO(start), to: toISO(end), days },
    totals: { feedback: total },
    categoryAverages: { food_quality: 4.8, service: 4.1, cleanliness: 4.7, staff_behaviour: 4.6, overall_satisfaction: 4.5 },
    sentiment: { positive, neutral, negative },
    ratingDistribution,
    trend,
    previous: {
      total: prevTotal,
      averageOverall: 4.32,
      categoryAverages: { food_quality: 4.6, service: 4.0, cleanliness: 4.6, staff_behaviour: 4.5, overall_satisfaction: 4.3 },
    },
  };
}
