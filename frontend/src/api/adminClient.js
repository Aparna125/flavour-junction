const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// Must be the same key your login page saves the token under.
const TOKEN_KEY = "adminToken";

export async function adminGet(path, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== "" && v != null)
      .map(([k, v]) => [k, String(v)])
  ).toString();

  let res;
  try {
    res = await fetch(`${API_URL}/api/admin${path}${query ? `?${query}` : ""}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` },
    });
  } catch {
    throw new Error("We couldn't reach the server. Please check your connection and try again.");
  }

  // The pages send the user to /admin/login when err.code === "AUTH"
  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    const err = new Error("Please sign in to continue.");
    err.code = "AUTH";
    throw err;
  }

  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {
      /* no JSON body */
    }
    throw new Error(message);
  }

  return res.json();
}