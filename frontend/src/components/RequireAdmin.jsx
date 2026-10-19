import { Navigate } from "react-router-dom";
import { getToken } from "../api/admin.js";

export default function RequireAdmin({ children }) {
  return getToken() ? children : <Navigate to="/admin/login" replace />;
}