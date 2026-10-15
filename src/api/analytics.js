import { adminGet, USE_SAMPLE } from "./adminFetch.js";
import { getSampleAnalytics } from "../data/sampleAnalytics.js";

/**
 * GET /api/admin/analytics?range=7|30|90        (preset period)
 * GET /api/admin/analytics?from=YYYY-MM-DD&to=YYYY-MM-DD   (custom period)
 *
 * Expected JSON:
 * {
 *   period: { from, to, days },
 *   totals: { feedback },
 *   categoryAverages: { food_quality, service, cleanliness, staff_behaviour, overall_satisfaction },
 *   sentiment: { positive, neutral, negative },          // counts
 *   ratingDistribution: { 1, 2, 3, 4, 5 },               // counts of OVERALL ratings
 *   trend: [{ label, average, count }],                  // daily (short periods) or weekly buckets
 *   previous: { total, averageOverall, categoryAverages } // the period of the same length just before
 * }
 */
export async function getAnalytics(query) {
  if (USE_SAMPLE) {
    await new Promise((r) => setTimeout(r, 250));
    return getSampleAnalytics(query);
  }
  const qs = new URLSearchParams();
  if (query.range === "custom") {
    qs.set("from", query.from);
    qs.set("to", query.to);
  } else {
    qs.set("range", query.range);
  }
  return adminGet(`/api/admin/analytics?${qs}`);
}
