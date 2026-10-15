// Flavour Junction backend (starter version, no database yet).
const express = require("express");
const cors = require("cors");
require("dotenv").config();
 
const app = express();
const PORT = process.env.PORT || 5000;
 
// Allow the React dev server to call this API.
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

const { router: adminAuthRouter } = require("./adminAuth");
app.use("/api/admin", adminAuthRouter);
 
// Quick check that the server is alive: open http://localhost:5000/api/health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "flavour-junction-api" });
});
 
const ratingFields = [
  "food_quality",
  "service",
  "cleanliness",
  "staff_behaviour",
  "overall_satisfaction",
];
 
// Receives the feedback form from React.
app.post("/api/feedback", (req, res) => {
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
 
  // TODO (next stages):
  //   1. send `comment` to the Python VADER service
  //   2. save ratings + comment + sentiment in MySQL
  // For now we only log it, so the frontend flow can be tested.
  console.log("Feedback received:", { ...req.body, name: name || "Anonymous" });
 
  res.status(201).json({ message: "Feedback received." });
});
 
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});