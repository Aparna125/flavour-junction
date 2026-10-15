// SAMPLE DATA for designing the dashboard before the backend/MySQL exists.
// Used only when VITE_USE_SAMPLE_DATA=true in frontend/.env. These are illustrative
// figures, not real restaurant data.
const DAY = 24 * 60 * 60 * 1000;

const seeded = (i) => Math.sin(i * 12.9898) * 0.5 + 0.5; // deterministic "randomness"
const round1 = (n) => Math.round(n * 10) / 10;

export function getSampleDashboard(range) {
  const total = { 7: 312, 30: 1248, 90: 3510 }[range] ?? 1248;
  const positive = Math.round(total * 0.88);
  const negative = Math.round(total * 0.04);
  const neutral = total - positive - negative;

  const share = { 5: 0.72, 4: 0.16, 3: 0.06, 2: 0.04, 1: 0.02 };
  const ratingDistribution = Object.fromEntries(
    Object.entries(share).map(([star, v]) => [star, Math.round(total * v)])
  );

  const now = Date.now();
  const trend = Array.from({ length: range }, (_, i) => {
    const progress = range > 1 ? i / (range - 1) : 1;
    const average = Math.min(5, Math.max(1, round1(4.1 + 0.5 * progress + (seeded(i) - 0.5) * 0.25)));
    return {
      date: new Date(now - (range - 1 - i) * DAY).toISOString(),
      average,
      count: Math.max(1, Math.round((total / range) * (0.7 + seeded(i + 50) * 0.6))),
    };
  });

  const prevTotal = Math.round(total / 1.12);
  const recent = [
    {
      id: 1003,
      createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
      overall: 5,
      sentiment: "positive",
      name: null,
      comment: "The glazed duck was cooked to perfection. Crispy skin, meltingly tender, and the pairing was flawless.",
    },
    {
      id: 1002,
      createdAt: new Date(now - 2.2 * 60 * 60 * 1000).toISOString(),
      overall: 4,
      sentiment: "neutral",
      name: "Sophia M.",
      comment: "Wonderful ambiance and courteous greeting, but slightly slow wine pairing between the fish and the main.",
    },
    {
      id: 1001,
      createdAt: new Date(now - 1.1 * DAY).toISOString(),
      overall: 5,
      sentiment: "positive",
      name: null,
      comment: "Flawless hospitality by our waiter! Anticipated our requests before we even asked.",
    },
  ];

  return {
    isSample: true,
    totals: { feedback: total },
    averageOverall: 4.6,
    sentiment: { positive, neutral, negative },
    ratingDistribution,
    trend,
    recent,
    previous: {
      total: prevTotal,
      positive: Math.round(prevTotal * 0.86),
      negative: Math.round(prevTotal * 0.054),
    },
  };
}
