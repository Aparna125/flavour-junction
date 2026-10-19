const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// Must match TOKEN_KEY in src/api/adminClient.js
const TOKEN_KEY = "adminToken";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const isLoggedIn = () => !!getToken();
export const logout = () => localStorage.removeItem(TOKEN_KEY);
export const logoutAdmin = logout;

export async function loginAdmin(a, b) {
  // Accept (identifier, password) or ({ identifier, password })
  const identifier = typeof a === "object" && a !== null ? a.identifier : a;
  const password = typeof a === "object" && a !== null ? a.password : b;

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

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Login failed. Please try again.");

  localStorage.setItem(TOKEN_KEY, data.token);
  return data;
}

export const adminLogin = loginAdmin;