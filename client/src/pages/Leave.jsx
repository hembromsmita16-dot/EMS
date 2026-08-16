import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  X,
  Plus,
  Thermometer,
  UmbrellaIcon,
  Palmtree,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Leave = () => {
  const { user } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const [formData, setFormData] = useState({
    type: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const isAdmin = user?.role === "ADMIN";

  // ================= FETCH LEAVES =================

  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/leave");

      setLeaves(res.data.data || []);

      if (res.data.employee?.isDeleted) {
        setIsDeleted(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Failed to load leaves"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // ================= FORMAT DATE =================

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateRange = (leave) => {
    return `${formatDate(leave.startDate)} — ${formatDate(
      leave.endDate
    )}`;
  };

  // ================= STATUS =================

  const getStatusClass = (status) => {
    if (status === "APPROVED") {
      return "badge badge-success";
    }

    if (status === "REJECTED") {
      return "badge badge-danger";
    }

    return "badge badge-warning";
  };

  // ================= EMPLOYEE NAME =================

  const getEmployeeName = (leave) => {
    const employee = Array.isArray(leave.employee)
      ? leave.employee[0]
      : leave.employee;

    if (!employee) {
      return "Unknown Employee";
    }

    return `${employee.firstName || ""} ${
      employee.lastName || ""
    }`.trim();
  };

  // ================= EMPLOYEE LEAVES =================

  const employeeLeaves = useMemo(() => {
    if (isAdmin) return [];

    return leaves;
  }, [leaves, isAdmin]);

  const takenLeaves = useMemo(() => {
    return employeeLeaves.filter(
      (leave) => leave.status === "APPROVED"
    );
  }, [employeeLeaves]);

  const sickLeaveCount = takenLeaves.filter(
    (leave) => leave.type === "SICK"
  ).length;

  const casualLeaveCount = takenLeaves.filter(
    (leave) => leave.type === "CASUAL"
  ).length;

  const annualLeaveCount = takenLeaves.filter(
    (leave) => leave.type === "ANNUAL"
  ).length;

  // ================= FORM CHANGE =================

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ================= APPLY LEAVE =================

  const handleApplyLeave = async (event) => {
    event.preventDefault();

    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.endDate < formData.startDate) {
      toast.error("End date cannot be before start date.");
      return;
    }

    try {
      await api.post("/leave", formData);

      toast.success("Leave request submitted successfully.");

      setFormData({
        type: "CASUAL",
        startDate: "",
        endDate: "",
        reason: "",
      });

      setShowModal(false);

      // Reload from MongoDB
      fetchLeaves();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Failed to submit leave request"
      );
    }
  };

  // ================= APPROVE =================

  const handleApprove = async (id) => {
  try {
    await api.patch(`/leave/${id}`, {
      status: "APPROVED",
    });

    toast.success("Leave approved successfully.");

    await fetchLeaves();
  } catch (error) {
    console.error("Approve leave error:", error);

    toast.error(
      error.response?.data?.error ||
        error.message ||
        "Failed to approve leave"
    );
  }
};

  // ================= REJECT =================

  const handleReject = async (id) => {
  try {
    await api.patch(`/leave/${id}`, {
      status: "REJECTED",
    });

    toast.success("Leave rejected successfully.");

    await fetchLeaves();
  } catch (error) {
    console.error("Reject leave error:", error);

    toast.error(
      error.response?.data?.error ||
        error.message ||
        "Failed to reject leave"
    );
  }
};

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        Loading leaves...
      </div>
    );
  }

  // ================= DELETED EMPLOYEE =================

  if (isDeleted) {
    return (
      <div className="py-12 text-center text-slate-500">
        Your employee account is inactive.
      </div>
    );
  }

  // =========================================================
  // ADMIN PAGE
  // =========================================================

  if (isAdmin) {
    return (
      <div className="animate-fade-in">

        <div className="page-header">
          <h1 className="page-title">
            Leave Management
          </h1>

          <p className="page-subtitle">
            Manage leave applications
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">

            <table className="table-modern">

              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {leaves.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-slate-500"
                    >
                      No leave applications found.
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => (
                    <tr key={leave._id}>

                      <td className="font-medium text-slate-700">
                        {getEmployeeName(leave)}
                      </td>

                      <td>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                          {leave.type}
                        </span>
                      </td>

                      <td className="text-slate-600">
                        {formatDateRange(leave)}
                      </td>

                      <td className="text-slate-600">
                        {leave.reason}
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            leave.status
                          )}
                        >
                          {leave.status}
                        </span>
                      </td>

                      <td>
                        {leave.status === "PENDING" ? (
                          <div className="flex items-center gap-3">

                            <button
                              type="button"
                              onClick={() =>
                                handleApprove(leave._id)
                              }
                              title="Approve"
                              className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center"
                            >
                              <Check size={18} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleReject(leave._id)
                              }
                              title="Reject"
                              className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center"
                            >
                              <X size={18} />
                            </button>

                          </div>
                        ) : (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                    </tr>
                  ))
                )}

              </tbody>

            </table>

          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // EMPLOYEE PAGE
  // =========================================================

  return (
    <div className="animate-fade-in">

      <div className="page-header flex items-start justify-between gap-4">

        <div>
          <h1 className="page-title">
            Leave Management
          </h1>

          <p className="page-subtitle">
            Your leave history and requests
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} />
          Apply for Leave
        </button>

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-xl border border-slate-200 p-5 border-l-4 border-l-slate-400">
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-lg bg-slate-50 flex items-center justify-center">
              <Thermometer
                size={22}
                className="text-slate-500"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Sick Leave
              </p>

              <span className="text-2xl font-semibold text-slate-900">
                {sickLeaveCount}
              </span>

              <span className="text-sm text-slate-400 ml-1">
                taken
              </span>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 border-l-4 border-l-slate-400">
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-lg bg-slate-50 flex items-center justify-center">
              <UmbrellaIcon
                size={22}
                className="text-slate-500"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Casual Leave
              </p>

              <span className="text-2xl font-semibold text-slate-900">
                {casualLeaveCount}
              </span>

              <span className="text-sm text-slate-400 ml-1">
                taken
              </span>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 border-l-4 border-l-slate-400">
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-lg bg-slate-50 flex items-center justify-center">
              <Palmtree
                size={22}
                className="text-slate-500"
              />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Annual Leave
              </p>

              <span className="text-2xl font-semibold text-slate-900">
                {annualLeaveCount}
              </span>

              <span className="text-sm text-slate-400 ml-1">
                taken
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* HISTORY */}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="table-modern">

            <thead>
              <tr>
                <th>Type</th>
                <th>Dates</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {employeeLeaves.length > 0 ? (

                employeeLeaves.map((leave) => (
                  <tr key={leave._id}>

                    <td>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        {leave.type}
                      </span>
                    </td>

                    <td className="text-slate-600">
                      {formatDateRange(leave)}
                    </td>

                    <td className="text-slate-600">
                      {leave.reason}
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          leave.status
                        )}
                      >
                        {leave.status}
                      </span>
                    </td>

                  </tr>
                ))

              ) : (

                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-10 text-slate-500"
                  >
                    No leave records found.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* APPLY MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">

            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Apply for Leave
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Submit your leave request
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={22} />
              </button>

            </div>

            <form
              onSubmit={handleApplyLeave}
              className="p-6 space-y-5"
            >

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Leave Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3"
                >
                  <option value="CASUAL">
                    Casual Leave
                  </option>

                  <option value="SICK">
                    Sick Leave
                  </option>

                  <option value="ANNUAL">
                    Annual Leave
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3"
                  />
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Enter the reason for your leave"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  Submit Request
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Leave;