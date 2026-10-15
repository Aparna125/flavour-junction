// Base URL of the Express backend. Set VITE_API_URL in a .env file.
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

/**
 * Sends the feedback to the Express API.
 * Resolves only when the backend confirms the feedback was saved.
 */
export async function submitFeedback(payload) {
  let res;
  try {
    res = await fetch(`${API_URL}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("We couldn't reach the server. Please check your connection and try again.");
  }

  if (!res.ok) {
    let message = "Something went wrong while saving your feedback. Please try again.";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      /* response had no JSON body */
    }
    throw new Error(message);
  }

  return res.json();
}
