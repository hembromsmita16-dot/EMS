import React from "react";
import {
  CalendarIcon,
  FileTextIcon,
  DollarSignIcon,
  ArrowRightIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const EmployeeDashboard = ({ data }) => {
  const emp = data?.employee;

  const cards = [
    {
      icon: CalendarIcon,
      value: data?.currentMonthAttendance ?? 0,
      title: "Days Present",
      subtitle: "This Month",
    },
    {
      icon: FileTextIcon,
      value: data?.pendingLeaves ?? 0,
      title: "Pending Leaves",
      subtitle: "Awaiting Approval",
    },
    {
      icon: DollarSignIcon,
      value: data?.latestPayslip
        ? `$${data.latestPayslip.netSalary?.toLocaleString() ?? "0"}`
        : "N/A",
      title: "Latest Payslip",
      subtitle: "Most Recent Payout",
    },
  ];

  return (
    <div className="animate-fade-in">

      {/* Page Header */}
      <div className="page-header mb-8">
        <h1 className="page-title">
          Welcome, {emp?.firstName || "Employee"}!
        </h1>

        <p className="page-subtitle">
          {emp?.position || "Employee"} -{" "}
          {emp?.department || "No Department"}
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="text-2xl font-semibold text-slate-800 mt-2">
                    {card.value}
                  </h2>

                  <p className="text-xs text-slate-400 mt-1">
                    {card.subtitle}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-600" />
                </div>
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

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/attendance"
            className="btn-primary text-center inline-flex items-center justify-center gap-2"
          >
            Mark Attendance
            <ArrowRightIcon className="w-4 h-4" />
          </Link>

          <Link
            to="/leave"
            className="btn-secondary text-center inline-flex items-center justify-center gap-2"
          >
            Apply for Leave
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default EmployeeDashboard;