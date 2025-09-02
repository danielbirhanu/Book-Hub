import React from "react";
import Main from "./Main/Main";
import Sidebar from "./Sidebar/Sidebar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <Main />
    </div>
  );
};

export default AdminDashboard;