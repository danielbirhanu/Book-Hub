import { Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, Layers, Edit, MessageSquare } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { to: "/admin/books/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/books/create", label: "Create Book", icon: <BookOpen size={20} /> },
    { to: "/admin/books/genre", label: "Create Genre", icon: <Layers size={20} /> },
    { to: "/admin/books-list", label: "Update Book", icon: <Edit size={20} /> },
    { to: "/admin/books/comments", label: "Comments", icon: <MessageSquare size={20} /> },
  ];

  return (
    <aside className="w-64 bg-white shadow-md border-r border-gray-200 hidden md:flex flex-col">
      <div className="p-6 text-2xl font-bold text-[#2c3e50]">Admin</div>
      <ul className="flex-1 px-4 space-y-2">
        {menuItems.map((item, idx) => (
          <li key={idx}>
            <Link
              to={item.to}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-700 transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
