import React, { useEffect, useState } from "react";
import {
  X,
  Loader2,
} from "lucide-react";

const EmployeeForm = ({
  employee = null,
  onCancel,
  onSubmit,
}) => {
  const isEditMode = !!employee;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    joinDate: "",
    bio: "",

    department: "",
    position: "",
    basicSalary: "0",
    allowances: "0",
    deductions: "0",
    status: "Active",

    workEmail: "",
    password: "",
    systemRole: "Employee",
  });

  // Fill form when editing
  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        phoneNumber: employee.phoneNumber || "",
        joinDate: employee.joinDate || "",
        bio: employee.bio || "",

        department: employee.department || "",
        position: employee.position || "",
        basicSalary: employee.basicSalary ?? "0",
        allowances: employee.allowances ?? "0",
        deductions: employee.deductions ?? "0",
        status: employee.status || "Active",

        workEmail: employee.workEmail || "",
        password: "",
        systemRole: employee.systemRole || "Employee",
      });
    }
  }, [employee]);

  // IMPORTANT:
  // This function updates only the changed field.
  // It does NOT recreate the form component.
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (onSubmit) {
        onSubmit(formData);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
      flex items-start justify-center p-4 overflow-y-auto"
      onClick={onCancel}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl
        w-full max-w-3xl my-8"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEditMode ? "Edit Employee" : "Add New Employee"}
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {isEditMode
                ? "Update employee details"
                : "Create a user account and employee profile"}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg text-slate-400
            hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="p-6 space-y-6">

            {/* ================= PERSONAL INFORMATION ================= */}
            <section className="border border-slate-200 rounded-xl p-5">

              <h3 className="text-sm font-semibold text-slate-800 pb-3
              border-b border-slate-100">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

                {/* First Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                    placeholder="First name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                    placeholder="Last name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                    placeholder="Phone number"
                  />
                </div>

                {/* Join Date */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Join Date
                  </label>

                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Bio */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Bio (Optional)
                  </label>

                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none resize-none
                    focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                    placeholder="Brief description..."
                  />
                </div>

              </div>
            </section>


            {/* ================= EMPLOYMENT DETAILS ================= */}
            <section className="border border-slate-200 rounded-xl p-5">

              <h3 className="text-sm font-semibold text-slate-800 pb-3
              border-b border-slate-100">
                Employment Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

                {/* Department */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Department
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Select Department</option>
                    <option value="IT Support">IT Support</option>
                    <option value="Engineering">Engineering</option>
                    <option value="HR">HR</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Position
                  </label>

                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                    placeholder="Software Developer"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Basic Salary
                  </label>

                  <input
                    type="number"
                    name="basicSalary"
                    value={formData.basicSalary}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Allowances */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Allowances
                  </label>

                  <input
                    type="number"
                    name="allowances"
                    value={formData.allowances}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Deductions */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Deductions
                  </label>

                  <input
                    type="number"
                    name="deductions"
                    value={formData.deductions}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              </div>
            </section>


            {/* ================= ACCOUNT SETUP ================= */}
            <section className="border border-slate-200 rounded-xl p-5">

              <h3 className="text-sm font-semibold text-slate-800 pb-3
              border-b border-slate-100">
                Account Setup
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">

                {/* Email */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Work Email
                  </label>

                  <input
                    type="email"
                    name="workEmail"
                    value={formData.workEmail}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                    placeholder="employee@example.com"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    Temporary Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                    placeholder="Temporary password"
                  />
                </div>

                {/* System Role */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">
                    System Role
                  </label>

                  <select
                    name="systemRole"
                    value={formData.systemRole}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm
                    bg-white border border-slate-200 rounded-lg
                    outline-none focus:border-indigo-400
                    focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

              </div>
            </section>

          </div>


          {/* ================= BUTTONS ================= */}
          <div className="flex flex-col-reverse sm:flex-row
          justify-end gap-3 px-6 pb-6 pt-2">

            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center"
            >
              {loading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}

              {isEditMode
                ? "Update Employee"
                : "Create Employee"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;