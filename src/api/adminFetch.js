import { getToken, clearToken } from "../auth/auth.js";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
export const USE_SAMPLE = import.meta.env.VITE_USE_SAMPLE_DATA === "true";

/** GET helper for private admin endpoints (adds the token, handles expired sessions). */
export async function adminGet(path) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${getToken()}` } });
  } catch {
    throw new Error("We couldn't reach the server. Please check your connection and try again.");
  }

  if (res.status === 401) {
    clearToken();
    const err = new Error("Your session has expired. Please sign in again.");
    err.code = "AUTH";
    throw err;
  }
  if (res.status === 404) {
    const err = new Error("That feedback entry could not be found.");
    err.code = "NOT_FOUND";
    throw err;
  }
  if (!res.ok) throw new Error("The data could not be loaded. Please try again.");
  return res.json();
}
