const express = require("express");
const db = require("./config/db");
const { requireAdmin } = require("./adminAuth");

const router = express.Router();
router.use(requireAdmin);

// ---------- helpers ----------
const n = (v) => Number(v) || 0;
const round2 = (v) => Math.round(n(v) * 100) / 100;
const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s)) && !isNaN(new Date(`${s}T00:00:00`));

const IN_PERIOD = "created_at >= ? AND created_at < DATE_ADD(?, INTERVAL 1 DAY)";

// Turns range ("7" | "30" | "90" | "custom") into a date period plus the
// previous period of the same length (used for the "vs previous" figures).
function resolvePeriod(range, from, to) {
  let start, end;
  if (range === "custom" && isDate(from) && isDate(to)) {
    start = new Date(`${from}T00:00:00`);
    end = new Date(`${to}T00:00:00`);
    if (start > end) [start, end] = [end, start];
  } else {
    const days = [7, 30, 90].includes(Number(range)) ? Number(range) : 30;
    end = new Date();
    end.setHours(0, 0, 0, 0);
    start = new Date(end);
    start.setDate(end.getDate() - (days - 1));
  }
  const length = Math.min(Math.round((end - start) / 86400000) + 1, 366);
  const prevEnd = new Date(start);
  prevEnd.setDate(start.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevEnd.getDate() - (length - 1));
  return { from: toISO(start), to: toISO(end), prevFrom: toISO(prevStart), prevTo: toISO(prevEnd) };
}

async function periodStats(from, to) {
  const [[row]] = await db.query(
    `SELECT COUNT(*) AS total,
            AVG(food_quality) AS food_quality,
            AVG(service) AS service,
            AVG(cleanliness) AS cleanliness,
            AVG(staff_behaviour) AS staff_behaviour,
            AVG(overall_satisfaction) AS overall_satisfaction,
            SUM(sentiment_label = 'Positive') AS positive,
            SUM(sentiment_label = 'Neutral')  AS neutral,
            SUM(sentiment_label = 'Negative') AS negative
     FROM feedback WHERE ${IN_PERIOD}`,
    [from, to]
  );
  const [distRows] = await db.query(
    `SELECT overall_satisfaction AS stars, COUNT(*) AS count
     FROM feedback WHERE ${IN_PERIOD} GROUP BY overall_satisfaction`,
    [from, to]
  );
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  distRows.forEach((r) => (ratingDistribution[r.stars] = n(r.count)));

  return {
    total: n(row.total),
    averageOverall: round2(row.overall_satisfaction),
    categoryAverages: {
      food_quality: round2(row.food_quality),
      service: round2(row.service),
      cleanliness: round2(row.cleanliness),
      staff_behaviour: round2(row.staff_behaviour),
      overall_satisfaction: round2(row.overall_satisfaction),
    },
    sentiment: { positive: n(row.positive), neutral: n(row.neutral), negative: n(row.negative) },
    ratingDistribution,
  };
}

async function periodTrend(from, to) {
  const [rows] = await db.query(
    `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS day,
            ROUND(AVG(overall_satisfaction), 2) AS average,
            COUNT(*) AS count
     FROM feedback WHERE ${IN_PERIOD}
     GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
     ORDER BY day`,
    [from, to]
  );
  return rows.map((r) => ({
    date: r.day,
    label: new Date(`${r.day}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    average: n(r.average),
    count: n(r.count),
  }));
}

// One feedback row in the shape the React pages use.
function mapItem(f) {
  return {
    id: f.id,
    name: f.name,
    email: f.email,
    createdAt: f.created_at,
    sentiment: String(f.sentiment_label).toLowerCase(), // "positive" | "neutral" | "negative"
    score: Number(f.sentiment_score),
    comment: f.comment,
    ratings: {
      food_quality: f.food_quality,
      service: f.service,
      cleanliness: f.cleanliness,
      staff_behaviour: f.staff_behaviour,
      overall_satisfaction: f.overall_satisfaction,
    },
  };
}

const ITEM_COLUMNS = `id, name, email, food_quality, service, cleanliness, staff_behaviour,
  overall_satisfaction, comment, sentiment_label, sentiment_score, created_at`;

// ---------- GET /api/admin/dashboard?range=7|30|90 ----------
router.get("/dashboard", async (req, res) => {
  try {
    const days = [7, 30, 90].includes(Number(req.query.range)) ? Number(req.query.range) : 7;
    const p = resolvePeriod(String(days));

    const [cur, prev, trend, [recentRows]] = await Promise.all([
      periodStats(p.from, p.to),
      periodStats(p.prevFrom, p.prevTo),
      periodTrend(p.from, p.to),
      db.query(`SELECT ${ITEM_COLUMNS} FROM feedback ORDER BY created_at DESC, id DESC LIMIT 5`),
    ]);

    res.json({
      totals: { feedback: cur.total },
      averageOverall: cur.averageOverall,
      sentiment: cur.sentiment,
      previous: { total: prev.total, negative: prev.sentiment.negative },
      ratingDistribution: cur.ratingDistribution,
      trend: trend.map(({ date, average, count }) => ({ date, average, count })),
      recent: recentRows.map((f) => ({
        id: f.id,
        createdAt: f.created_at,
        sentiment: String(f.sentiment_label).toLowerCase(),
        overall: f.overall_satisfaction,
        comment: f.comment,
        name: f.name,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load the dashboard." });
  }
});

// ---------- GET /api/admin/analytics?range=7|30|90|custom&from=&to= ----------
router.get("/analytics", async (req, res) => {
  try {
    const p = resolvePeriod(req.query.range, req.query.from, req.query.to);
    const [cur, prev, trend] = await Promise.all([
      periodStats(p.from, p.to),
      periodStats(p.prevFrom, p.prevTo),
      periodTrend(p.from, p.to),
    ]);

    res.json({
      period: { from: p.from, to: p.to },
      totals: { feedback: cur.total },
      averageOverall: cur.averageOverall,
      categoryAverages: cur.categoryAverages,
      sentiment: cur.sentiment,
      ratingDistribution: cur.ratingDistribution,
      trend,
      // null when the previous period had no feedback (the page then hides the comparison)
      previous: prev.total
        ? { total: prev.total, averageOverall: prev.averageOverall, categoryAverages: prev.categoryAverages }
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load analytics." });
  }
});

// ---------- GET /api/admin/feedback (Feedback Hub list) ----------
router.get("/feedback", async (req, res) => {
  try {
    const { search = "", sentiment = "all", rating = "all", range = "30", sort = "newest" } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize) || 10, 1), 50);

    // Filters shared by the chip counts and the list (everything except sentiment)
    const where = [];
    const params = [];
    if (["7", "30", "90"].includes(String(range))) {
      where.push("created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)");
      params.push(Number(range) - 1);
    }
    if (["1", "2", "3", "4", "5"].includes(String(rating))) {
      where.push("overall_satisfaction = ?");
      params.push(Number(rating));
    }
    const term = String(search).trim();
    if (term) {
      where.push("(comment LIKE ? OR name LIKE ?)");
      params.push(`%${term}%`, `%${term}%`);
    }
    const baseSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const [[c]] = await db.query(
      `SELECT COUNT(*) AS total,
              SUM(sentiment_label = 'Positive') AS positive,
              SUM(sentiment_label = 'Neutral')  AS neutral,
              SUM(sentiment_label = 'Negative') AS negative
       FROM feedback ${baseSql}`,
      params
    );
    const counts = { all: n(c.total), positive: n(c.positive), neutral: n(c.neutral), negative: n(c.negative) };

    // The list also applies the sentiment chip
    const listWhere = [...where];
    const listParams = [...params];
    const sent = String(sentiment).toLowerCase();
    if (["positive", "neutral", "negative"].includes(sent)) {
      listWhere.push("sentiment_label = ?");
      listParams.push(sent.charAt(0).toUpperCase() + sent.slice(1));
    }
    const listSql = listWhere.length ? `WHERE ${listWhere.join(" AND ")}` : "";
    const orderBy = sort === "oldest" ? "created_at ASC, id ASC" : "created_at DESC, id DESC";

    const total = ["positive", "neutral", "negative"].includes(sent) ? counts[sent] : counts.all;

    const [rows] = await db.query(
      `SELECT ${ITEM_COLUMNS} FROM feedback ${listSql} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...listParams, pageSize, (page - 1) * pageSize]
    );

    res.json({
      items: rows.map(mapItem),
      total,
      counts,
      pageCount: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load feedback." });
  }
});

// ---------- GET /api/admin/feedback/:id (Inspect sheet) ----------
router.get("/feedback/:id", async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT ${ITEM_COLUMNS} FROM feedback WHERE id = ?`, [Number(req.params.id)]);
    if (!rows.length) return res.status(404).json({ message: "Feedback not found." });
    res.json(mapItem(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not load this feedback." });
  }
});

module.exports = router;