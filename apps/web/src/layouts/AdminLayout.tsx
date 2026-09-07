import {
  BookOpen,
  LibraryBig,
  ChevronLeft,
  Flag,
  Gauge,
  LogOut,
  MessageSquareText,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const adminLinks = [
  { icon: Gauge, label: "Overview", to: "/admin" },
  { icon: LibraryBig, label: "Catalog", to: "/admin/books" },
  { icon: MessageSquareText, label: "Reviews", to: "/admin/reviews" },
  { icon: Flag, label: "Reports", to: "/admin/reports" },
  { icon: Users, label: "Members", to: "/admin/members" },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    username: string;
    isAdmin: boolean;
  } | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    void fetch("/api/v1/auth/me", { credentials: "include" })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { username: string; isAdmin: boolean })
          : null
      )
      .then(setUser)
      .finally(() => setReady(true));
  }, []);
  async function signOut() {
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    void navigate("/login");
  }
  if (!ready)
    return (
      <main className="catalog-state">Checking administrator access...</main>
    );
  if (!user?.isAdmin)
    return (
      <main className="placeholder-page">
        <p className="eyebrow">Restricted area</p>
        <h1>Administrator access required.</h1>
        <Link className="inline-link" to="/login">
          Sign in with an administrator account
        </Link>
      </main>
    );
  const initials = user.username
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand brand-light" to="/admin">
          <BookOpen aria-hidden="true" size={23} />
          <span>Book Hub</span>
        </Link>
        <nav aria-label="Administration">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink end={item.to === "/admin"} key={item.to} to={item.to}>
                <Icon aria-hidden="true" size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/">
            <ChevronLeft aria-hidden="true" size={18} /> Public site
          </Link>
          <button onClick={() => void signOut()} type="button">
            <LogOut aria-hidden="true" size={18} /> Sign out
          </button>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-header">
          <div className="admin-search">
            <Search aria-hidden="true" size={18} />
            <span>Search administration</span>
          </div>
          <div
            className="admin-user"
            aria-label={`Signed in as ${user.username}`}
          >
            <span>{initials}</span>
            <div>
              <strong>{user.username}</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>
        <main className="admin-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
