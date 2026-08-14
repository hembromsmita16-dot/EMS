import React, { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import { dummyEmployeeData } from "../assets/assets";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "../components/EmployeeForm";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // ================= FETCH EMPLOYEES =================

  const fetchEmployees = useCallback(async () => {
    setLoading(true);

    const timer = setTimeout(() => {
      setEmployees((currentEmployees) => {
        // If employees were already added/modified while loading,
        // don't overwrite those changes with the dummy data.
        if (currentEmployees.length > 0) {
          return currentEmployees;
        }

        return dummyEmployeeData || [];
      });

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cleanup = fetchEmployees();

    return cleanup;
  }, [fetchEmployees]);

  // ================= DEPARTMENTS =================

const departments = [
  "All Departments",
  ...new Set(
    employees
      .map((employee) => employee.department)
      .filter(Boolean)
  ),
];

useEffect(() => {
  if (!departments.includes(department)) {
    setDepartment("All Departments");
  }
}, [departments, department]);

  // ================= FILTER =================

  const filteredEmployees = employees.filter((employee) => {
    const fullName =
      `${employee.firstName || ""} ${employee.lastName || ""}`.toLowerCase();

    const searchText = search.toLowerCase();

    const matchesSearch = fullName.includes(searchText);

    const matchesDepartment =
      department === "All Departments" ||
      employee.department === department;

    return matchesSearch && matchesDepartment;
  });

  // ================= ADD =================

  const handleAddEmployee = () => {
    if (loading) return;

    setEditingEmployee(null);
    setShowCreateModal(true);
  };

  // ================= EDIT =================

  const handleEdit = (employee) => {
    setShowCreateModal(false);
    setEditingEmployee(employee);
  };

  // ================= DELETE =================

  const handleDelete = (employee) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    setEmployees((currentEmployees) =>
      currentEmployees.filter((item) => item.id !== employee.id)
    );
  };

  // ================= CREATE =================

  const handleCreateSubmit = (formData) => {
    const newEmployee = {
      id: Date.now(),

      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      joinDate: formData.joinDate,
      bio: formData.bio,

      department: formData.department,
      position: formData.position,
      basicSalary: Number(formData.basicSalary) || 0,
      allowances: Number(formData.allowances) || 0,
      deductions: Number(formData.deductions) || 0,
      status: formData.status,

      workEmail: formData.workEmail,
      systemRole: formData.systemRole,
    };

    setEmployees((currentEmployees) => [
      ...currentEmployees,
      newEmployee,
    ]);

    setShowCreateModal(false);
  };

  // ================= UPDATE =================

  const handleUpdateSubmit = (formData) => {
    if (!editingEmployee) return;

    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.id === editingEmployee.id
          ? {
              ...employee,

              firstName: formData.firstName,
              lastName: formData.lastName,
              phoneNumber: formData.phoneNumber,
              joinDate: formData.joinDate,
              bio: formData.bio,

              department: formData.department,
              position: formData.position,
              basicSalary: Number(formData.basicSalary) || 0,
              allowances: Number(formData.allowances) || 0,
              deductions: Number(formData.deductions) || 0,
              status: formData.status,

              workEmail: formData.workEmail,
              systemRole: formData.systemRole,
            }
          : employee
      )
    );

    setEditingEmployee(null);
  };

  return (
    <div className="animate-fade-in">
      {/* ================= HEADER ================= */}

      <div
        className="flex flex-col sm:flex-row
        sm:items-start sm:justify-between
        gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Employees
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your team members
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddEmployee}
          disabled={loading}
          className={`inline-flex items-center
          justify-center gap-2
          text-white text-sm font-medium
          px-4 py-2.5 rounded-lg
          shadow-sm transition-colors
          w-full sm:w-auto
          ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <Plus size={16} />
          {loading ? "Loading..." : "Add Employee"}
        </button>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2
            -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            aria-label="Search employees"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4
            text-sm bg-white
            border border-slate-200
            rounded-lg outline-none
            focus:border-indigo-400
            focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          aria-label="Filter by department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="h-10 px-3 min-w-[160px]
          text-sm text-slate-600
          bg-white border border-slate-200
          rounded-lg outline-none
          focus:border-indigo-400"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* ================= EMPLOYEE LIST ================= */}

      {loading ? (
        <div className="py-12 text-center text-slate-500">
          Loading employees...
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div
          className="py-12 text-center
          text-slate-500 bg-white
          rounded-xl border border-slate-200"
        >
          No employees found.
        </div>
      ) : (
        <div
          className="grid grid-cols-1
          sm:grid-cols-2 lg:grid-cols-3
          gap-4"
        >
          {filteredEmployees.map((employee, index) => (
            <EmployeeCard
              key={employee.id || index}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ================= ADD EMPLOYEE MODAL ================= */}

      {showCreateModal && (
        <EmployeeForm
          onCancel={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {/* ================= EDIT EMPLOYEE MODAL ================= */}

      {editingEmployee && (
        <EmployeeForm
          employee={editingEmployee}
          onCancel={() => setEditingEmployee(null)}
          onSubmit={handleUpdateSubmit}
        />
      )}
    </div>
  );
};

export default Employees;