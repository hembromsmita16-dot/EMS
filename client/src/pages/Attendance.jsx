import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Clock3,
  LogIn,
  LogOut,
} from "lucide-react";

import {
  dummyAttendanceData,
  getDayTypeDisplay,
  getWorkingHoursDisplay,
} from "../assets/assets";

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(() => {
    setHistory(dummyAttendanceData || []);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  const stats = useMemo(() => {
    const presentDays = history.filter(
      (record) => record.status === "PRESENT"
    ).length;

    const totalHours = history.reduce(
      (sum, record) => sum + (Number(record.workingHours) || 0),
      0
    );

    return {
      presentDays,
      totalHours,
      averageHours: history.length
        ? (totalHours / history.length).toFixed(1)
        : "0.0",
    };
  }, [history]);

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">
          Loading attendance...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Attendance
        </h1>

        <p className="page-subtitle">
          Track your work hours and daily check-ins
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

        {/* Present Days */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Days Present
              </p>

              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {stats.presentDays}
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-indigo-600" />
            </div>

          </div>
        </div>

        {/* Total Hours */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Hours
              </p>

              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {stats.totalHours}h
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Clock3 className="w-5 h-5 text-indigo-600" />
            </div>

          </div>
        </div>

        {/* Average Hours */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Average / Day
              </p>

              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {stats.averageHours}h
              </p>
            </div>

            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Clock3 className="w-5 h-5 text-indigo-600" />
            </div>

          </div>
        </div>

      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-200">

          <h2 className="text-lg font-semibold text-slate-900">
            Attendance History
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Your recent attendance records
          </p>

        </div>

        {history.length === 0 ? (

          <div className="py-12 text-center text-slate-500">
            No attendance records found.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="table-modern">

              <thead>

                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Day Type</th>
                </tr>

              </thead>

              <tbody>

                {history.map((record) => {

                  const dayType = getDayTypeDisplay(record);

                  return (

                    <tr
                      key={
                        record._id ||
                        record.id ||
                        record.date
                      }
                    >

                      {/* Date */}
                      <td className="font-medium text-slate-700">
                        {formatDate(record.date)}
                      </td>

                      {/* Check In */}
                      <td className="text-slate-600">

                        <span className="inline-flex items-center gap-1.5">

                          <LogIn className="w-4 h-4 text-emerald-600" />

                          {formatTime(record.checkIn)}

                        </span>

                      </td>

                      {/* Check Out */}
                      <td className="text-slate-600">

                        <span className="inline-flex items-center gap-1.5">

                          <LogOut className="w-4 h-4 text-rose-500" />

                          {formatTime(record.checkOut)}

                        </span>

                      </td>

                      {/* Working Hours */}
                      <td className="font-medium text-slate-700">
                        {getWorkingHoursDisplay(record)}
                      </td>

                      {/* Status */}
                      <td>

                        <span
                          className={`badge ${
                            record.status === "PRESENT"
                              ? "badge-success"
                              : "badge-danger"
                          }`}
                        >
                          {record.status || "—"}
                        </span>

                      </td>

                      {/* Day Type */}
                      <td>

                        <span
                          className={`badge ${dayType.className}`}
                        >
                          {dayType.label}
                        </span>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default Attendance;