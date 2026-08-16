import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const Layout = () => {
  const {user, loading} = useAuth()

    if(loading) return <Loading />
    if(!user) return <Navigate to="/login"/>
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 sm:p-8 lg:p-10 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default Layout;