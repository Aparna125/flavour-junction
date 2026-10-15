// Keeps the admin token on this device.
// "Remember this device" -> localStorage (survives closing the browser)
// otherwise              -> sessionStorage (cleared when the tab closes)
const KEY = "fj_admin_token";

export function getToken() {
  return sessionStorage.getItem(KEY) || localStorage.getItem(KEY);
}

export function setToken(token, remember = false) {
  clearToken();
  (remember ? localStorage : sessionStorage).setItem(KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(KEY);
  localStorage.removeItem(KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}
