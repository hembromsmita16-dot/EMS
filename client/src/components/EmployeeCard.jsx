import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const EmployeeCard = ({ employee, onDelete, onEdit }) => {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await api.delete(`/employees/${employee.id}`);

      toast.success("Employee deleted successfully");

      if (onDelete) {
        onDelete(employee);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.message ||
          "Failed to delete employee"
      );
    }
  };

  const initials =
    `${employee.firstName?.charAt(0) || ""}${employee.lastName?.charAt(0) || ""}`;

  return (
    <div className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">

      {/* Department */}
      <div className="p-3">
        <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600">
          {employee.department || "No Department"}
        </span>
      </div>

      {/* Avatar */}
      <div className="h-28 bg-slate-50 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
          <span className="text-lg font-medium text-indigo-500">
            {initials}
          </span>
        </div>
      </div>

      {/* Employee info */}
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            {employee.firstName} {employee.lastName}
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            {employee.position || "Employee"}
          </p>
        </div>

        {/* Edit / Delete */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

          <button
            type="button"
            onClick={() => onEdit(employee)}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 flex items-center justify-center"
          >
            <Pencil size={16} />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 flex items-center justify-center"
          >
            <Trash2 size={16} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;