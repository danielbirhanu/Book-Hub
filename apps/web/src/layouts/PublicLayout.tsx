import { BookOpen, Instagram, Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { AppLinkButton } from "../ui/Button";
import { useAuth } from "../auth/AuthContext";

const primaryLinks = [
  { label: "Discover", to: "/discover" },
  { label: "Browse", to: "/browse" },
  { label: "My Books", to: "/my-books" },
];

export function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  return (
    <div className="public-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Book Hub home">
          <BookOpen aria-hidden="true" size={25} strokeWidth={1.8} />
          <span>Book Hub</span>
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryLinks.map((link) => (
            <NavLink
              className={({ isActive }) => (isActive ? "active" : undefined)}
              key={link.to}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="icon-button desktop-only"
            type="button"
            aria-label="Search"
          >
            <Search aria-hidden="true" size={20} />
          </button>
          {user ? (
            <button
              className="text-link desktop-only"
              onClick={() => void signOut()}
              type="button"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link className="text-link desktop-only" to="/login">
                Sign in
              </Link>
              <AppLinkButton
                className="desktop-only"
                size="small"
                to="/register"
              >
                Join Book Hub
              </AppLinkButton>
            </>
          )}
          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            className="icon-button menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>
      <div
        className={`mobile-navigation ${menuOpen ? "mobile-navigation-open" : ""}`}
        id="mobile-navigation"
      >
        <nav aria-label="Mobile navigation">
          {primaryLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/login">Sign in</NavLink>
        </nav>
        <AppLinkButton size="large" to="/register">
          Join Book Hub
        </AppLinkButton>
      </div>
      <div id="main-content">
        <Outlet />
      </div>
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-intro">
            <Link className="brand brand-light" to="/">
              <BookOpen aria-hidden="true" size={25} />
              <span>Book Hub</span>
            </Link>
            <p>
              A thoughtful home for books read, remembered, and recommended.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <h2>Explore</h2>
              <Link to="/discover">Discover</Link>
              <Link to="/browse">Browse books</Link>
              <Link to="/my-books">Reading lists</Link>
            </div>
            <div>
              <h2>Book Hub</h2>
              <Link to="/about">About</Link>
              <Link to="/guidelines">Community guidelines</Link>
              <Link to="/privacy">Privacy</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <small>© 2026 Book Hub</small>
          <a aria-label="Book Hub on Instagram" href="https://instagram.com">
            <Instagram aria-hidden="true" size={18} />
          </a>
        </div>
      </footer>
    </div>
  );
}
