import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  UserIcon,
  XIcon,
  MenuIcon,
  LayoutDashboardIcon,
  UsersIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  ReceiptIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";

import { dummyProfileData } from "../assets/assets";

const Sidebar = () => {
  const { pathname } = useLocation();

  const [userName, setUserName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setUserName(
      dummyProfileData.firstName + " " + dummyProfileData.lastName
    );
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const role = dummyProfileData.role || "EMPLOYEE";

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Employees",
      path: "/employees",
      icon: UsersIcon,
    },
    {
      name: "Attendance",
      path: "/attendance",
      icon: CalendarCheckIcon,
    },
    {
      name: "Leave",
      path: "/leave",
      icon: CalendarDaysIcon,
    },
    {
      name: "Payslips",
      path: "/payslips",
      icon: ReceiptIcon,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: SettingsIcon,
    },
  ];

  const sidebarContent = (
    <>
      {/* Brand header */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <UserIcon className="text-white size-6" />
            </div>

            <div>
              <p className="font-semibold text-[13px] text-white tracking-wide">
                Employee MS
              </p>

              <p className="text-[11px] text-slate-500 font-medium">
                Management System
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            <XIcon size={20} />
          </button>
        </div>
      </div>

      {/* User profile card */}
      {userName && (
        <div className="mx-3 mt-4 mb-1 p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center ring-1 ring-white/10 shrink-0">
              <span className="text-slate-400 text-xs font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-[13px] font-medium text-slate-200 truncate">
                {userName}
              </p>

              <p className="text-[11px] text-slate-500 truncate">
                {role === "ADMIN" ? "Administrator" : "Employee"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section label */}
      <div className="px-5 mt-6 mb-2">
        <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold">
          Main Menu
        </p>
      </div>

      {/* Navigation List */}
      <nav className="px-3 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto p-3 border-t border-white/10">
        <a
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-white transition"
        >
          <LogOutIcon size={18} />
          <span>Logout</span>
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-white/10"
      >
        <MenuIcon size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col h-screen w-[260px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white shrink-0 border-r border-white/10">
        {sidebarContent}
      </aside>

      {/* Sidebar - mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white z-50 flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;