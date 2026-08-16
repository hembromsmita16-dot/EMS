import React, { useCallback, useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/axios";
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

    try {
      const url =
        department !== "All Departments"
          ? `/employees?department=${encodeURIComponent(department)}`
          : "/employees";

      const res = await api.get(url);

      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);

      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Failed to fetch employees"
      );
    } finally {
      setLoading(false);
    }
  }, [department]);

  useEffect(() => {
    fetchEmployees();
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
    setEditingEmployee(null);
    setShowCreateModal(true);
  };

  // ================= EDIT =================

  const handleEdit = (employee) => {
    setShowCreateModal(false);
    setEditingEmployee(employee);
  };

  // ================= DELETE =================

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/employees/${employee.id}`);

      toast.success("Employee deleted successfully");

      await fetchEmployees();
    } catch (error) {
      console.error("Delete employee error:", error);

      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Failed to delete employee"
      );
    }
  };

  // ================= CREATE =================

  const handleCreateSubmit = async (formData) => {
    try {
      const employeeData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.workEmail,
        phone: formData.phoneNumber,
        position: formData.position,
        department: formData.department,
        basicSalary: Number(formData.basicSalary) || 0,
        allowances: Number(formData.allowances) || 0,
        deductions: Number(formData.deductions) || 0,
        joinDate: formData.joinDate,
        password: formData.password,
        role:
          formData.systemRole === "Admin"
            ? "ADMIN"
            : "EMPLOYEE",
        bio: formData.bio,
      };

      await api.post("/employees", employeeData);

      toast.success("Employee created successfully");

      setShowCreateModal(false);

      await fetchEmployees();
    } catch (error) {
      console.error("Create employee error:", error);

      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Failed to create employee"
      );
    }
  };

  // ================= UPDATE =================

  const handleUpdateSubmit = async (formData) => {
    if (!editingEmployee) return;

    try {
      const employeeData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.workEmail,
        phone: formData.phoneNumber,
        position: formData.position,
        department: formData.department,
        basicSalary: Number(formData.basicSalary) || 0,
        allowances: Number(formData.allowances) || 0,
        deductions: Number(formData.deductions) || 0,
        bio: formData.bio,
        employmentStatus:
          formData.status === "Inactive"
            ? "INACTIVE"
            : "ACTIVE",
        role:
          formData.systemRole === "Admin"
            ? "ADMIN"
            : "EMPLOYEE",
      };

      // Only send password if user entered one
      if (formData.password) {
        employeeData.password = formData.password;
      }

      await api.put(
        `/employees/${editingEmployee.id}`,
        employeeData
      );

      toast.success("Employee updated successfully");

      setEditingEmployee(null);

      await fetchEmployees();
    } catch (error) {
      console.error("Update employee error:", error);

      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Failed to update employee"
      );
    }
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
          className="inline-flex items-center
          justify-center gap-2
          text-white text-sm font-medium
          px-4 py-2.5 rounded-lg
          shadow-sm transition-colors
          w-full sm:w-auto
          bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus size={16} />
          Add Employee
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
              key={employee.id || employee._id || index}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ================= ADD EMPLOYEE ================= */}

      {showCreateModal && (
        <EmployeeForm
          onCancel={() => setShowCreateModal(false)}
          onSubmit={handleCreateSubmit}
        />
      )}

      {/* ================= EDIT EMPLOYEE ================= */}

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