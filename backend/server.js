// Flavour Junction backend
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the React dev server to call this API.
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

const { router: adminAuthRouter } = require("./adminAuth");
const adminDataRouter = require("./adminData");

app.use("/api/admin", adminAuthRouter);  // login
app.use("/api/admin", adminDataRouter);  // feedback list + analytics (needs token)
// Quick check that the server is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "flavour-junction-api" });
});

// Quick check that MySQL is connected
app.get("/api/test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM feedback");
    res.json({ message: "DB connected", feedbackCount: rows[0].total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB connection failed", error: err.message });
  }
});

const ratingFields = [
  "food_quality",
  "service",
  "cleanliness",
  "staff_behaviour",
  "overall_satisfaction",
];

// Receives the feedback form from React.
app.post("/api/feedback", async (req, res) => {
  const { comment, name, email } = req.body;

  // Server-side validation (never trust the frontend alone).
  for (const field of ratingFields) {
    const value = req.body[field];
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      return res.status(400).json({ message: `${field} must be a whole number from 1 to 5.` });
    }
  }
  if (typeof comment !== "string" || !comment.trim() || comment.length > 500) {
    return res.status(400).json({ message: "Comment is required (maximum 500 characters)." });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Email address is not valid." });
  }

  try {
    // 1. Get sentiment from the Python VADER service
    const { data } = await axios.post(process.env.SENTIMENT_URL, { text: comment });

    // 2. Save everything in MySQL
    await db.execute(
      `INSERT INTO feedback
        (name, email, food_quality, service, cleanliness, staff_behaviour,
         overall_satisfaction, comment, sentiment_label, sentiment_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name || null,
        email || null,
        req.body.food_quality,
        req.body.service,
        req.body.cleanliness,
        req.body.staff_behaviour,
        req.body.overall_satisfaction,
        comment.trim(),
        data.label,
        data.score,
      ]
    );

    res.status(201).json({ message: "Feedback received.", sentiment: data.label });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Could not save feedback. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});