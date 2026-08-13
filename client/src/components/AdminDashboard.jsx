import React from "react";
import {
  Building2Icon,
  UsersIcon,
  CalendarIcon,
  FileTextIcon,
} from "lucide-react";

const AdminDashboard = ({ data }) => {
  const stats = [
    {
      icon: UsersIcon,
      value: data?.totalEmployees ?? 0,
      label: "Total Employees",
      description: "Active workforce",
    },
    {
      icon: Building2Icon,
      value: data?.totalDepartments ?? 0,
      label: "Departments",
      description: "Organization units",
    },
    {
      icon: CalendarIcon,
      value: data?.todaysAttendance ?? 0,
      label: "Today's Attendance",
      description: "Checked-in today",
    },
    {
      icon: FileTextIcon,
      value: data?.pendingLeaves ?? 0,
      label: "Pending Leaves",
      description: "Awaiting Approval",
    },
  ];

  return (
    <div className="animate-fade-in">

      {/* Page Header */}
      <div className="page-header mb-8">
        <h1 className="page-title">
          Dashboard
        </h1>

        <p className="page-subtitle">
          Welcome back, Admin! Here's a quick overview
        </p>
      </div>

      {/* Dashboard Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
        gap-4 sm:gap-5 mb-8"
      >
        {stats.map((s) => {
          const Icon = s.icon;

          return (
            <div
              key={s.label}
              className="group bg-white rounded-xl border border-slate-200
              p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">

                {/* Text */}
                <div>
                  <p className="text-sm text-slate-500">
                    {s.label}
                  </p>

                  <h2 className="text-2xl font-bold text-slate-900 mt-2">
                    {s.value}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    {s.description}
                  </p>
                </div>

                {/* Icon */}
                <Icon
                  className="w-10 h-10 p-2.5 rounded-lg
                  bg-slate-100 text-slate-600
                  group-hover:bg-indigo-50
                  group-hover:text-indigo-600
                  transition-colors duration-200"
                />

              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Quick Actions
        </h2>
      </div>

    </div>
  );
};

export default AdminDashboard;