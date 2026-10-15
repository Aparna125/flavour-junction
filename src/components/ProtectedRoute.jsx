import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../auth/auth.js";

// Sends visitors without a token to the login page.
// NOTE: this only hides the screens. The Express API must still check the token
// on every admin request, because anyone can edit the frontend in their browser.
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  if (!isLoggedIn()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
