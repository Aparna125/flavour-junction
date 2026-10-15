import { getToken, clearToken } from "../auth/auth.js";
import { getSampleDashboard } from "../data/sampleDashboard.js";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const USE_SAMPLE = import.meta.env.VITE_USE_SAMPLE_DATA === "true";

/**
 * GET /api/admin/dashboard?range=7|30|90   (needs the admin token)
 *
 * Expected JSON from the backend:
 * {
 *   totals: { feedback },
 *   averageOverall,                                   // 1-5
 *   sentiment: { positive, neutral, negative },       // counts
 *   ratingDistribution: { 1, 2, 3, 4, 5 },            // counts of overall ratings
 *   trend: [{ date, average, count }],                // one item per day
 *   recent: [{ id, createdAt, overall, sentiment, name, comment }],
 *   previous: { total, positive, negative }           // same figures for the period before
 * }
 */
export async function getDashboard(range) {
  if (USE_SAMPLE) {
    await new Promise((r) => setTimeout(r, 250));
    return getSampleDashboard(range);
  }

  let res;
  try {
    res = await fetch(`${API_URL}/api/admin/dashboard?range=${range}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
  } catch {
    throw new Error("We couldn't reach the server. Please check your connection and try again.");
  }

  if (res.status === 401) {
    clearToken();
    const err = new Error("Your session has expired. Please sign in again.");
    err.code = "AUTH";
    throw err;
  }
  if (!res.ok) throw new Error("The dashboard data could not be loaded. Please try again.");
  return res.json();
}
