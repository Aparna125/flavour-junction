// SAMPLE DATA for designing the Feedback Management page before the backend exists.
// Used only when VITE_USE_SAMPLE_DATA=true. Illustrative, not real guest feedback.
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

// [food, service, cleanliness, staff, overall], sentiment score, comment, name, email
const templates = [
  [[5, 5, 5, 5, 5], 0.94, "The glazed duck was cooked to perfection. Crispy skin, meltingly tender, and the pairing was flawless.", null, null],
  [[4, 3, 5, 4, 4], 0.01, "Wonderful ambiance and courteous greeting, but slightly slow wine pairing between the fish and the main.", "Sophia M.", "sophia.m@example.com"],
  [[5, 5, 5, 5, 5], 0.91, "Flawless hospitality by our waiter! Anticipated our requests before we even asked.", null, null],
  [[5, 5, 5, 5, 5], 0.89, "The roasted chanterelles and sourdough pairing was unforgettable. Attentive pacing throughout the evening.", "Sophia Montgomery", "sophia.m@example.com"],
  [[3, 3, 4, 4, 3], 0.02, "Food was okay. Nothing special.", null, null],
  [[2, 1, 4, 3, 2], -0.64, "The service was very slow, and the food arrived cold.", null, null],
  [[4, 4, 5, 5, 5], 0.78, "Lovely staff and a spotless dining room. Will come back.", "Arun K.", "arun.k@example.com"],
  [[3, 1, 4, 3, 2], -0.55, "Waited 40 minutes for our mains. Disappointing for the price.", null, null],
  [[5, 4, 2, 4, 4], 0.31, "Great flavours, though the table was a little sticky when we sat down.", null, null],
  [[5, 4, 4, 5, 5], 0.85, "Absolutely delicious. The fish curry was the best I've had.", "Meera S.", null],
  [[3, 3, 4, 3, 3], -0.06, "Average evening. Music was too loud to talk.", null, null],
  [[3, 2, 4, 1, 2], -0.72, "Staff were rude when we asked to change tables.", null, null],
  [[4, 5, 5, 4, 4], 0.68, "Pleasant atmosphere and quick service.", null, null],
  [[4, 4, 4, 4, 4], 0.12, "Portions were small but tasty.", "Rahul V.", "rahul.v@example.com"],
];

const sentimentOf = (s) => (s >= 0.05 ? "positive" : s <= -0.05 ? "negative" : "neutral");

const now = Date.now();
const offsets = [45 * 60 * 1000, 2.2 * HOUR, 1.1 * DAY];

export const ALL_FEEDBACK = Array.from({ length: 70 }, (_, i) => {
  const [r, score, comment, name, email] = templates[i % templates.length];
  const age = i < 3 ? offsets[i] : 1.4 * DAY + (i - 3) * 0.37 * DAY + ((i * 7) % 11) * HOUR * 0.3;
  return {
    id: 1003 - i,
    createdAt: new Date(now - age).toISOString(),
    name,
    email,
    comment,
    score,
    sentiment: sentimentOf(score),
    ratings: {
      food_quality: r[0],
      service: r[1],
      cleanliness: r[2],
      staff_behaviour: r[3],
      overall_satisfaction: r[4],
    },
  };
});

export function sampleList({ search = "", sentiment = "all", rating = "all", range = "30", sort = "newest", page = 1, pageSize = 10 }) {
  const term = search.trim().toLowerCase();
  const since = range === "all" ? 0 : now - Number(range) * DAY;

  // Counts ignore the sentiment filter, so the chips show what each choice would give.
  const base = ALL_FEEDBACK.filter(
    (f) =>
      new Date(f.createdAt).getTime() >= since &&
      (rating === "all" || f.ratings.overall_satisfaction === Number(rating)) &&
      (!term || f.comment.toLowerCase().includes(term) || (f.name ?? "").toLowerCase().includes(term))
  );
  const counts = {
    all: base.length,
    positive: base.filter((f) => f.sentiment === "positive").length,
    neutral: base.filter((f) => f.sentiment === "neutral").length,
    negative: base.filter((f) => f.sentiment === "negative").length,
  };

  const filtered = sentiment === "all" ? base : base.filter((f) => f.sentiment === sentiment);
  filtered.sort((a, b) =>
    sort === "oldest"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : new Date(b.createdAt) - new Date(a.createdAt)
  );

  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    counts,
    page,
    pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)),
  };
}

export function sampleItem(id) {
  return ALL_FEEDBACK.find((f) => String(f.id) === String(id)) ?? null;
}
