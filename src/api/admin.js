const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

/**
 * Logs the manager in.
 * Expects the backend to answer { token: "..." } when the credentials are valid.
 */
export async function loginAdmin({ identifier, password }) {
  let res;
  try {
    res = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
  } catch {
    throw new Error("We couldn't reach the server. Please check your connection and try again.");
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* no JSON body */
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(data?.message || "Invalid credentials. Please check your details and try again.");
    }
    throw new Error(data?.message || "Sign-in is unavailable right now. Please try again shortly.");
  }

  if (!data?.token) throw new Error("Sign-in failed. Please try again.");
  return data;
}
