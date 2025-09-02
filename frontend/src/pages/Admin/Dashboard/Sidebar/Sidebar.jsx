import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: "/admin/books/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/books/create", label: "Create Book", icon: "📝" },
    { path: "/admin/books/genre", label: "Create Genre", icon: "🏷️" },
    { path: "/admin/books/update", label: "Update Book", icon: "🔄" },
    { path: "/admin/books/comments", label: "Comments", icon: "💬" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white flex-shrink-0 hidden md:block">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent">
          Admin Panel
        </h1>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-green-500 to-lime-400 text-gray-900 font-semibold shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-lime-300 flex items-center justify-center">
            <span className="text-gray-900 font-bold">A</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;