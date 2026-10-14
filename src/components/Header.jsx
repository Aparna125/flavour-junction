import { Link, NavLink } from "react-router-dom";
import { UserIcon, LeafIcon } from "./Icons.jsx";
import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand" aria-label="Flavour Junction home">
          <span className="brand__logo" aria-hidden="true">
            <LeafIcon width={18} height={18} />
          </span>
          <span className="brand__text">
            <span className="brand__name">Flavour Junction</span>
            <span className="brand__sub">Home</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/feedback">Feedback</NavLink>
        </nav>

        <Link to="/admin/login" className="avatar-btn" aria-label="Admin login">
          <UserIcon width={20} height={20} />
        </Link>
      </div>
    </header>
  );
}
