// controllers/feedbackController.js (core idea)
const axios = require('axios');
const db = require('../config/db');

exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, food_quality, service, cleanliness, staff_behaviour, overall, comment } = req.body;

    let label = 'Neutral', score = 0;
    if (comment && comment.trim()) {
      const { data } = await axios.post(process.env.SENTIMENT_URL, { text: comment });
      label = data.label; score = data.score;
    }

    await db.execute(
      `INSERT INTO feedback (name,email,food_quality,service,cleanliness,staff_behaviour,overall,comment,sentiment_label,sentiment_score)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [name || null, email || null, food_quality, service, cleanliness, staff_behaviour, overall, comment || null, label, score]
    );
    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};