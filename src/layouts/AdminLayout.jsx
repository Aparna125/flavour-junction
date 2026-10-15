import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearToken } from "../auth/auth.js";
import { LeafIcon, UserIcon, LogoutIcon } from "../components/Icons.jsx";
import "./AdminLayout.css";

const tabs = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/feedback", label: "Feedback" },
  { to: "/admin/analytics", label: "Analytics" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = tabs.find((t) => pathname.startsWith(t.to))?.label ?? "Admin";

  const signOut = () => {
    clearToken();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin">
      <header className="admin-top">
        <div className="admin-top__inner">
          <div className="admin-brand">
            <span className="admin-brand__logo" aria-hidden="true"><LeafIcon width={18} height={18} /></span>
            <span className="admin-brand__text">
              <span className="admin-brand__name">Flavour Junction</span>
              <span className="admin-brand__sub">{current}</span>
            </span>
          </div>
          <span className="admin-avatar" aria-hidden="true"><UserIcon width={20} height={20} /></span>
        </div>
      </header>

      <div className="console">
        <div className="console__row">
          <span className="console__title"><span className="live-dot" aria-hidden="true" /> Manager Console</span>
          <button type="button" className="console__logout" onClick={signOut}>
            <LogoutIcon width={18} height={18} /> Logout
          </button>
        </div>
        <nav className="console__tabs" aria-label="Admin sections">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to} className="console__tab">{t.label}</NavLink>
          ))}
        </nav>
      </div>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
