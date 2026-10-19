import { adminGet } from "./adminClient.js";

// query is { range: "30" } or { range: "custom", from: "YYYY-MM-DD", to: "YYYY-MM-DD" }
export const getAnalytics = (query) => adminGet("/analytics", query);