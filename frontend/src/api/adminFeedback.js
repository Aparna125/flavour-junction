import { adminGet, USE_SAMPLE } from "./adminFetch.js";
import { sampleList, sampleItem } from "../data/sampleFeedback.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * GET /api/admin/feedback?search=&sentiment=&rating=&range=&sort=&page=&pageSize=
 *   sentiment: positive | neutral | negative   (omit for all)
 *   rating:    1-5, matches the OVERALL rating (omit for all)
 *   range:     7 | 30 | 90 | all               sort: newest | oldest
 *
 * Expected JSON:
 * {
 *   items: [{ id, createdAt, name, email, comment, score, sentiment,
 *             ratings: { food_quality, service, cleanliness, staff_behaviour, overall_satisfaction } }],
 *   total,                                           // matching the current filters
 *   counts: { all, positive, neutral, negative },    // same filters, but ignoring `sentiment`
 *   page, pageCount
 * }
 */
export async function listFeedback(params) {
  if (USE_SAMPLE) {
    await wait(250);
    return sampleList(params);
  }
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.sentiment !== "all") qs.set("sentiment", params.sentiment);
  if (params.rating !== "all") qs.set("rating", params.rating);
  qs.set("range", params.range);
  qs.set("sort", params.sort);
  qs.set("page", params.page);
  qs.set("pageSize", params.pageSize);
  return adminGet(`/api/admin/feedback?${qs}`);
}

/** GET /api/admin/feedback/:id -> a single item (same shape as above) */
export async function getFeedbackItem(id) {
  if (USE_SAMPLE) {
    await wait(150);
    const item = sampleItem(id);
    if (!item) {
      const err = new Error("That feedback entry could not be found.");
      err.code = "NOT_FOUND";
      throw err;
    }
    return item;
  }
  return adminGet(`/api/admin/feedback/${encodeURIComponent(id)}`);
}
