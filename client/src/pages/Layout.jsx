import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="hidden md:block w-64 bg-slate-950 text-white p-6">
        <h2 className="text-xl font-bold">EMS</h2>
        <p className="text-slate-400 mt-2">Employee Management</p>
      </aside>
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;