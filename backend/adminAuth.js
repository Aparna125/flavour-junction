// TEMPORARY admin login for development (no database yet).
// Reads ONE admin account from backend/.env. It will be replaced by a MySQL
// `admins` table with hashed passwords in the database stage.
const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const router = express.Router();

// Constant-time comparison, so response timing doesn't reveal how close a guess was.
function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

// POST /api/admin/login  ->  { token }
router.post("/login", (req, res) => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
    return res.status(503).json({ message: "Admin login is not configured on the server." });
  }

  const { identifier, password } = req.body ?? {};
  if (typeof identifier !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Please enter your username or email and password." });
  }

  const userOk = safeEqual(identifier.trim().toLowerCase(), ADMIN_EMAIL.trim().toLowerCase());
  const passOk = safeEqual(password, ADMIN_PASSWORD);
  if (!(userOk && passOk)) {
    return res
      .status(401)
      .json({ message: "Invalid management credentials. Please check your details and try again." });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h", subject: ADMIN_EMAIL });
  res.json({ token });
});

// Use this on every private admin API route.
function requireAdmin(req, res, next) {
  const [type, token] = (req.headers.authorization || "").split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Please sign in to continue." });
  }
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Your session has expired. Please sign in again." });
  }
}

// GET /api/admin/me -> quick check that a token is valid
router.get("/me", requireAdmin, (req, res) => res.json({ admin: true }));

module.exports = { router, requireAdmin };
