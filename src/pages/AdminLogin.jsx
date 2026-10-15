import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/admin.js";
import { isLoggedIn, setToken } from "../auth/auth.js";
import {
  UtensilsIcon,
  SparkleIcon,
  ShieldIcon,
  CloseIcon,
  LeafIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  LoginIcon,
  ArrowLeftIcon,
} from "../components/Icons.jsx";
import "./AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already signed in? Go straight to the dashboard.
  if (isLoggedIn()) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Please enter both your username or email and your password.");
      return;
    }

    setSubmitting(true);
    try {
      const { token } = await loginAdmin({ identifier: identifier.trim(), password });
      setToken(token, remember);
      navigate(location.state?.from ?? "/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login">
      {/* Brand hero */}
      <header className="login__hero">
        <span className="login__badge" aria-hidden="true"><UtensilsIcon width={34} height={34} /></span>
        <h1>Flavour Junction</h1>
        <p>Manager &amp; Feedback Analytics Portal</p>
        <div className="login__rule" aria-hidden="true">
          <span /><SparkleIcon width={14} height={14} /><span />
        </div>
      </header>

      {/* Sign-in card */}
      <section className="login__card" aria-labelledby="login-title">
        <h2 id="login-title">Manager Sign In</h2>
        <p className="login__sub">Authorized staff only</p>

        {error && (
          <div className="alert" role="alert">
            <ShieldIcon width={24} height={24} className="alert__icon" />
            <div className="alert__body">
              <strong>Authentication Refused</strong>
              <p>{error}</p>
            </div>
            <button type="button" className="alert__close" onClick={() => setError("")} aria-label="Dismiss message">
              <CloseIcon width={20} height={20} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="lf">
            <label htmlFor="identifier">Username or Email</label>
            <div className="lf__input">
              <LeafIcon width={20} height={20} />
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="Enter your username or email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="lf">
            <label htmlFor="password">Password</label>
            <div className="lf__input">
              <LockIcon width={20} height={20} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="lf__eye"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOffIcon width={22} height={22} /> : <EyeIcon width={22} height={22} />}
              </button>
            </div>
          </div>

          <label className="remember">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span className="remember__box" aria-hidden="true"><CheckIcon width={16} height={16} /></span>
            Remember this device
          </label>

          <button type="submit" className="login__submit" disabled={submitting}>
            {submitting ? "Signing in…" : <>Sign In <LoginIcon width={20} height={20} /></>}
          </button>
        </form>

        <p className="login__foot">Protected internal portal. No public registration.</p>
      </section>

      <Link to="/" className="login__back"><ArrowLeftIcon width={16} height={16} /> Back to Flavour Junction</Link>
    </main>
  );
}
