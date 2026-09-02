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
import { Link, NavLink, Outlet } from "react-router-dom";

const adminLinks = [
  { icon: Gauge, label: "Overview", to: "/admin" },
  { icon: LibraryBig, label: "Catalog", to: "/admin/books" },
  { icon: MessageSquareText, label: "Reviews", to: "/admin/reviews" },
  { icon: Flag, label: "Reports", to: "/admin/reports" },
  { icon: Users, label: "Members", to: "/admin/members" },
];

export function AdminLayout() {
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
          <button type="button">
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
          <div className="admin-user" aria-label="Signed in as Amara Tesfaye">
            <span>AT</span>
            <div>
              <strong>Amara Tesfaye</strong>
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
