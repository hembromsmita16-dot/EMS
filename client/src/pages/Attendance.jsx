import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarCheck,
  Clock3,
  LogIn,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";

import {
  getDayTypeDisplay,
  getWorkingHoursDisplay,
} from "../assets/assets";

const Attendance = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ================= FETCH ATTENDANCE =================

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/attendance");

      const json = res.data;

      setHistory(json.data || []);

      if (json.employee?.isDeleted) {
        setIsDeleted(true);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ================= TODAY'S ATTENDANCE =================

  const todayRecord = useMemo(() => {
    if (!history.length) return null;

    const today = new Date();

    return history.find((record) => {
      const recordDate = new Date(record.date);

      return (
        recordDate.getFullYear() === today.getFullYear() &&
        recordDate.getMonth() === today.getMonth() &&
        recordDate.getDate() === today.getDate()
      );
    });
  }, [history]);

  const isCheckedIn = Boolean(
    todayRecord?.checkIn && !todayRecord?.checkOut
  );

  const isCheckedOut = Boolean(
    todayRecord?.checkIn && todayRecord?.checkOut
  );

  // ================= CLOCK IN / OUT =================

  const handleClockInOut = async () => {
    if (isDeleted) {
      toast.error(
        "Your employee account is inactive."
      );
      return;
    }

    try {
      setActionLoading(true);

      const res = await api.post("/attendance");

      const type = res.data?.type;

      if (type === "CHECK_IN") {
        toast.success("Clocked in successfully.");
      } else if (type === "CHECK_OUT") {
        toast.success("Clocked out successfully.");
      } else {
        toast.success("Attendance updated successfully.");
      }

      await fetchData();
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Attendance operation failed"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ================= STATISTICS =================

  const stats = useMemo(() => {
    const presentDays = history.filter(
      (record) =>
        record.status === "PRESENT" ||
        record.status === "LATE"
    ).length;

    const totalHours = history.reduce(
      (sum, record) =>
        sum + (Number(record.workingHours) || 0),
      0
    );

    return {
      presentDays,
      totalHours: totalHours.toFixed(2),
      averageHours: history.length
        ? (totalHours / history.length).toFixed(1)
        : "0.0",
    };
  }, [history]);

  // ================= FORMAT DATE =================

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ================= FORMAT TIME =================

  const formatTime = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">
          Loading attendance...
        </p>
      </div>
    );
  }

  // ================= DELETED EMPLOYEE =================

  if (isDeleted) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">
          Your employee account is inactive.
        </p>
      </div>
    );
  }

  // ================= PAGE =================

  return (
    <div className="animate-fade-in">

      {/* Header */}

      <div className="page-header flex items-start justify-between gap-4">

        <div>
          <h1 className="page-title">
            Attendance
          </h1>

          <p className="page-subtitle">
            Track your work hours and daily check-ins
          </p>
        </div>

        {/* CLOCK BUTTON */}

        <button
          type="button"
          onClick={handleClockInOut}
          disabled={
            actionLoading || isCheckedOut
          }
          className={`btn-primary flex items-center gap-2 whitespace-nowrap ${
            isCheckedOut
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {actionLoading ? (
            "Processing..."
          ) : isCheckedIn ? (
            <>
              <LogOut className="w-4 h-4" />
              Clock Out
            </>
          ) : isCheckedOut ? (
            <>
              <LogOut className="w-4 h-4" />
              Completed
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              Clock In
            </>
          )}
        </button>

      </div>

      {/* TODAY STATUS */}

      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <p className="text-sm text-slate-500">
              Today's Attendance
            </p>

            {!todayRecord && (
              <p className="text-lg font-semibold text-slate-800 mt-1">
                Not Clocked In
              </p>
            )}

            {isCheckedIn && (
              <p className="text-lg font-semibold text-emerald-600 mt-1">
                Currently Working
              </p>
            )}

            {isCheckedOut && (
              <p className="text-lg font-semibold text-indigo-600 mt-1">
                Attendance Completed
              </p>
            )}

          </div>

          <div className="text-sm text-slate-500">

            {todayRecord?.checkIn && (
              <p>
                Check In:{" "}
                <span className="font-medium text-slate-700">
                  {formatTime(todayRecord.checkIn)}
                </span>
              </p>
            )}

            {todayRecord?.checkOut && (
              <p>
                Check Out:{" "}
                <span className="font-medium text-slate-700">
                  {formatTime(todayRecord.checkOut)}
                </span>
              </p>
            )}

          </div>

        </div>

      </div>

      {/* STATISTICS */}

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

      {/* ATTENDANCE HISTORY */}

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

                  const dayType =
                    getDayTypeDisplay(record);

                  return (
                    <tr
                      key={
                        record._id ||
                        record.id ||
                        record.date
                      }
                    >

                      <td className="font-medium text-slate-700">
                        {formatDate(record.date)}
                      </td>

                      <td className="text-slate-600">

                        <span className="inline-flex items-center gap-1.5">

                          <LogIn className="w-4 h-4 text-emerald-600" />

                          {formatTime(record.checkIn)}

                        </span>

                      </td>

                      <td className="text-slate-600">

                        <span className="inline-flex items-center gap-1.5">

                          <LogOut className="w-4 h-4 text-rose-500" />

                          {formatTime(record.checkOut)}

                        </span>

                      </td>

                      <td className="font-medium text-slate-700">
                        {getWorkingHoursDisplay(record)}
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            record.status === "PRESENT"
                              ? "badge-success"
                              : record.status === "LATE"
                              ? "badge-warning"
                              : "badge-danger"
                          }`}
                        >
                          {record.status || "—"}
                        </span>

                      </td>

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