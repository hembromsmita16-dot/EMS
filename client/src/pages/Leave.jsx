import { useMemo, useState } from "react";
import {
  Check,
  X,
  Plus,
  Thermometer,
  Umbrella,
  Palmtree,
} from "lucide-react";

import {
  dummyLeaveData,
  dummyProfileData,
} from "../assets/assets";

const ROLE_KEY = "ems_role";

const Leave = () => {
  // Get the role saved during login
  const role =
    localStorage.getItem(ROLE_KEY) || "EMPLOYEE";

  const [leaves, setLeaves] = useState(
    dummyLeaveData || []
  );

  const [showModal, setShowModal] =
    useState(false);

  const [formData, setFormData] = useState({
    type: "CASUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  /* =====================================================
     COMMON FUNCTIONS
  ===================================================== */

  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const formatDateRange = (leave) => {
    return `${formatDate(
      leave.startDate
    )} — ${formatDate(leave.endDate)}`;
  };

  const getStatusClass = (status) => {
    if (status === "APPROVED") {
      return "badge badge-success";
    }

    if (status === "REJECTED") {
      return "badge badge-danger";
    }

    return "badge badge-warning";
  };

  const getEmployeeName = (leave) => {
    const employee = Array.isArray(
      leave.employee
    )
      ? leave.employee[0]
      : leave.employee;

    if (!employee) {
      return "Unknown Employee";
    }

    return `${employee.firstName || ""} ${
      employee.lastName || ""
    }`.trim();
  };

  /* =====================================================
     EMPLOYEE DATA
  ===================================================== */

  const employeeLeaves = useMemo(() => {
    return leaves.filter(
      (leave) =>
        leave.employeeId ===
        dummyProfileData._id
    );
  }, [leaves]);

  // Only APPROVED leaves count as "taken"
  const takenLeaves = useMemo(() => {
    return employeeLeaves.filter(
      (leave) =>
        leave.status === "APPROVED"
    );
  }, [employeeLeaves]);

  const sickLeaveCount =
    takenLeaves.filter(
      (leave) => leave.type === "SICK"
    ).length;

  const casualLeaveCount =
    takenLeaves.filter(
      (leave) => leave.type === "CASUAL"
    ).length;

  const annualLeaveCount =
    takenLeaves.filter(
      (leave) => leave.type === "ANNUAL"
    ).length;

  /* =====================================================
     ADMIN ACTIONS
  ===================================================== */

  const handleApprove = (id) => {
    setLeaves((currentLeaves) =>
      currentLeaves.map((leave) =>
        leave._id === id
          ? {
              ...leave,
              status: "APPROVED",
            }
          : leave
      )
    );
  };

  const handleReject = (id) => {
    setLeaves((currentLeaves) =>
      currentLeaves.map((leave) =>
        leave._id === id
          ? {
              ...leave,
              status: "REJECTED",
            }
          : leave
      )
    );
  };

  /* =====================================================
     EMPLOYEE APPLY FOR LEAVE
  ===================================================== */

  const handleInputChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleApplyLeave = (event) => {
    event.preventDefault();

    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.reason
    ) {
      return;
    }

    if (
      formData.endDate <
      formData.startDate
    ) {
      alert(
        "End date cannot be before start date."
      );
      return;
    }

    const newLeave = {
      _id: `local-${Date.now()}`,

      employeeId:
        dummyProfileData._id,

      type: formData.type,

      startDate:
        formData.startDate,

      endDate:
        formData.endDate,

      reason:
        formData.reason.trim(),

      status: "PENDING",

      employee:
        dummyProfileData,
    };

    setLeaves((current) => [
      ...current,
      newLeave,
    ]);

    setFormData({
      type: "CASUAL",
      startDate: "",
      endDate: "",
      reason: "",
    });

    setShowModal(false);
  };

  /* =====================================================
     ADMIN PAGE
  ===================================================== */

  if (role === "ADMIN") {
    return (
      <div className="animate-fade-in">

        {/* Header */}
        <div className="page-header">

          <h1 className="page-title">
            Leave Management
          </h1>

          <p className="page-subtitle">
            Manage leave applications
          </p>

        </div>

        {/* Table */}
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

                {leaves.map((leave) => (

                  <tr key={leave._id}>

                    {/* Employee */}
                    <td className="font-medium text-slate-700">
                      {getEmployeeName(
                        leave
                      )}
                    </td>

                    {/* Type */}
                    <td>

                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                        {leave.type}
                      </span>

                    </td>

                    {/* Dates */}
                    <td className="text-slate-600">
                      {formatDateRange(
                        leave
                      )}
                    </td>

                    {/* Reason */}
                    <td className="text-slate-600">
                      {leave.reason}
                    </td>

                    {/* Status */}
                    <td>

                      <span
                        className={getStatusClass(
                          leave.status
                        )}
                      >
                        {leave.status}
                      </span>

                    </td>

                    {/* Actions */}
                    <td>

                      {leave.status ===
                      "PENDING" ? (

                        <div className="flex items-center gap-3">

                          {/* Approve */}
                          <button
                            type="button"
                            onClick={() =>
                              handleApprove(
                                leave._id
                              )
                            }
                            title="Approve"
                            className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center"
                          >
                            <Check size={18} />
                          </button>

                          {/* Reject */}
                          <button
                            type="button"
                            onClick={() =>
                              handleReject(
                                leave._id
                              )
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

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    );
  }

  /* =====================================================
     EMPLOYEE PAGE
  ===================================================== */

  return (
    <div className="animate-fade-in">

      {/* Header */}
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
          onClick={() =>
            setShowModal(true)
          }
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Plus size={18} />

          Apply for Leave
        </button>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {/* Sick Leave */}
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

              <div className="flex items-baseline gap-1">

                <span className="text-2xl font-semibold text-slate-900">
                  {sickLeaveCount}
                </span>

                <span className="text-sm text-slate-400">
                  taken
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Casual Leave */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 border-l-4 border-l-slate-400">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-lg bg-slate-50 flex items-center justify-center">

              <Umbrella
                size={22}
                className="text-slate-500"
              />

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Casual Leave
              </p>

              <div className="flex items-baseline gap-1">

                <span className="text-2xl font-semibold text-slate-900">
                  {casualLeaveCount}
                </span>

                <span className="text-sm text-slate-400">
                  taken
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Annual Leave */}
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

              <div className="flex items-baseline gap-1">

                <span className="text-2xl font-semibold text-slate-900">
                  {annualLeaveCount}
                </span>

                <span className="text-sm text-slate-400">
                  taken
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Leave History */}
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

                employeeLeaves.map(
                  (leave) => (

                    <tr key={leave._id}>

                      <td>

                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                          {leave.type}
                        </span>

                      </td>

                      <td className="text-slate-600">
                        {formatDateRange(
                          leave
                        )}
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

                  )
                )

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

      {/* Apply Leave Modal */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">

            {/* Modal Header */}
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
                onClick={() =>
                  setShowModal(false)
                }
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={22} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={
                handleApplyLeave
              }
              className="p-6 space-y-5"
            >

              {/* Type */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Leave Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={
                    handleInputChange
                  }
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

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={
                      formData.startDate
                    }
                    onChange={
                      handleInputChange
                    }
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
                    value={
                      formData.endDate
                    }
                    onChange={
                      handleInputChange
                    }
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3"
                  />

                </div>

              </div>

              {/* Reason */}
              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={
                    formData.reason
                  }
                  onChange={
                    handleInputChange
                  }
                  rows="4"
                  placeholder="Enter the reason for your leave"
                  required
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 resize-none"
                />

              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
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