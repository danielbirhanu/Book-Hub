import Main from "./Main/Main";
import Sidebar from "./Sidebar/Sidebar";

const AdminDashboard = () => {
  return (
    <div className="flex bg-[#f8f9fa] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Main />
      </main>
    </div>
  );
};

export default AdminDashboard;
