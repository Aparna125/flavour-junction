import { adminGet } from "./adminClient.js";

// params: { search, sentiment, rating, range, sort, page, pageSize }
export const listFeedback = (params) => adminGet("/feedback", params);

export const getFeedbackItem = (id) => adminGet(`/feedback/${encodeURIComponent(id)}`);