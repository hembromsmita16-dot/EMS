import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  Plus,
  Download,
} from "lucide-react";

import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import api from "../api/axios";


// ======================================================
// MONTH NAMES
// ======================================================

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


// ======================================================
// GET PERIOD
// ======================================================

const getPeriod = (payslip) => {
  const month = Number(payslip.month);
  const year = Number(payslip.year);

  if (
    month >= 1 &&
    month <= 12 &&
    year
  ) {
    return `${months[month - 1]} ${year}`;
  }

  return "—";
};


// ======================================================
// PAYSLIPS
// ======================================================

const Payslips = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";


  const [payslips, setPayslips] = useState([]);

  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);


  // ======================================================
  // FORM DATA
  // ======================================================

  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    year: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
  });


  // ======================================================
  // FETCH PAYSLIPS
  // ======================================================

  const fetchPayslips = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/payslips");

      setPayslips(res.data.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to load payslips"
      );
    } finally {
      setLoading(false);
    }
  }, []);


  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);


  // ======================================================
  // FETCH EMPLOYEES
  // ======================================================

  useEffect(() => {
    if (!isAdmin) return;

    const fetchEmployees = async () => {
      try {
        const res = await api.get("/employees");

        const employeeData = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];

        setEmployees(
          employeeData.filter(
            (employee) => !employee.isDeleted
          )
        );
      } catch (error) {
        toast.error(
          error?.response?.data?.error ||
            error?.message ||
            "Failed to load employees"
        );
      }
    };

    fetchEmployees();
  }, [isAdmin]);


  // ======================================================
  // FORMAT MONEY
  // ======================================================

  const formatMoney = (amount) => {
    return `$${Number(amount || 0).toLocaleString()}`;
  };


  // ======================================================
  // GET EMPLOYEE NAME
  // ======================================================

  const getEmployeeName = (payslip) => {
    const employee = Array.isArray(payslip.employee)
      ? payslip.employee[0]
      : payslip.employee;

    if (!employee) {
      return "Unknown Employee";
    }

    return `${employee.firstName || ""} ${
      employee.lastName || ""
    }`.trim();
  };


  // ======================================================
  // EMPLOYEE PAYSLIPS
  // ======================================================

  const employeePayslips = useMemo(() => {
    if (isAdmin) {
      return [];
    }

    return payslips;
  }, [payslips, isAdmin]);


  // ======================================================
  // PRINT / DOWNLOAD
  // ======================================================

  const handlePrintPayslip = (payslip) => {
    navigate("/print-payslip", {
      state: {
        payslip,
      },
    });
  };


  // ======================================================
  // GENERATE PAYSLIP
  // ======================================================

  const handleGeneratePayslip = async (event) => {
    event.preventDefault();

    if (
      !formData.employeeId ||
      !formData.month ||
      !formData.year ||
      !formData.basicSalary
    ) {
      toast.error(
        "Please fill in all required fields."
      );

      return;
    }


    try {
      await api.post("/payslips", {
        employeeId: formData.employeeId,

        month: Number(formData.month),

        year: Number(formData.year),

        basicSalary: Number(
          formData.basicSalary
        ),

        allowances: Number(
          formData.allowances || 0
        ),

        deductions: Number(
          formData.deductions || 0
        ),
      });


      toast.success(
        "Payslip generated successfully."
      );


      setFormData({
        employeeId: "",
        month: "",
        year: "",
        basicSalary: "",
        allowances: "",
        deductions: "",
      });


      setShowModal(false);


      await fetchPayslips();

    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to generate payslip"
      );
    }
  };


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        Loading payslips...
      </div>
    );
  }


  // ======================================================
  // ADMIN PAGE
  // ======================================================

  if (isAdmin) {
    return (
      <div className="animate-fade-in">

        {/* HEADER */}

        <div className="page-header flex items-start justify-between gap-4">

          <div>

            <h1 className="page-title">
              Payslips
            </h1>

            <p className="page-subtitle">
              Generate and manage employee payslips
            </p>

          </div>


          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />

            Generate Payslip
          </button>

        </div>


        {/* ADMIN TABLE */}

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="table-modern">

              <thead>

                <tr>

                  <th>
                    Employee
                  </th>

                  <th>
                    Period
                  </th>

                  <th>
                    Basic Salary
                  </th>

                  <th>
                    Allowances
                  </th>

                  <th>
                    Deductions
                  </th>

                  <th>
                    Net Salary
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {payslips.length > 0 ? (

                  payslips.map((payslip) => (

                    <tr
                      key={
                        payslip._id ||
                        payslip.id
                      }
                    >

                      <td className="font-medium text-slate-700">

                        {getEmployeeName(
                          payslip
                        )}

                      </td>


                      <td className="text-slate-500">

                        {getPeriod(
                          payslip
                        )}

                      </td>


                      <td className="text-slate-500">

                        {formatMoney(
                          payslip.basicSalary
                        )}

                      </td>


                      <td className="text-slate-500">

                        {formatMoney(
                          payslip.allowances
                        )}

                      </td>


                      <td className="text-slate-500">

                        {formatMoney(
                          payslip.deductions
                        )}

                      </td>


                      <td className="font-semibold text-slate-800">

                        {formatMoney(
                          payslip.netSalary
                        )}

                      </td>


                      <td>

                        <button
                          type="button"
                          onClick={() =>
                            handlePrintPayslip(
                              payslip
                            )
                          }
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium"
                        >

                          <Download
                            size={14}
                          />

                          Download

                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="text-center py-10 text-slate-500"
                    >
                      No payslips found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* GENERATE MODAL */}

        {showModal && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">


              {/* MODAL HEADER */}

              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

                <div>

                  <h2 className="text-xl font-semibold text-slate-900">
                    Generate Payslip
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Create a new employee payslip
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="text-slate-400 hover:text-slate-700 text-xl"
                >
                  ×
                </button>

              </div>


              {/* FORM */}

              <form
                onSubmit={
                  handleGeneratePayslip
                }
                className="p-6 space-y-5"
              >


                {/* EMPLOYEE */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Employee
                  </label>


                  <select
                    value={
                      formData.employeeId
                    }
                    onChange={(event) =>
                      setFormData(
                        (current) => ({
                          ...current,

                          employeeId:
                            event.target.value,
                        })
                      )
                    }
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3"
                  >

                    <option value="">
                      Select Employee
                    </option>


                    {employees.map(
                      (employee) => (

                        <option
                          key={
                            employee._id ||
                            employee.id
                          }
                          value={
                            employee._id ||
                            employee.id
                          }
                        >

                          {
                            employee.firstName
                          }{" "}

                          {
                            employee.lastName
                          }

                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* MONTH + YEAR */}

                <div className="grid grid-cols-2 gap-4">

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Month
                    </label>


                    <select
                      value={
                        formData.month
                      }
                      onChange={(event) =>
                        setFormData(
                          (current) => ({
                            ...current,

                            month:
                              event.target.value,
                          })
                        )
                      }
                      required
                      className="w-full border border-slate-300 rounded-lg px-4 py-3"
                    >

                      <option value="">
                        Select Month
                      </option>


                      {months.map(
                        (month, index) => (

                          <option
                            key={month}
                            value={index + 1}
                          >
                            {month}
                          </option>

                        )
                      )}

                    </select>

                  </div>


                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Year
                    </label>


                    <input
                      type="number"
                      min="2000"
                      max="2100"
                      value={
                        formData.year
                      }
                      onChange={(event) =>
                        setFormData(
                          (current) => ({
                            ...current,

                            year:
                              event.target.value,
                          })
                        )
                      }
                      required
                      placeholder="2026"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3"
                    />

                  </div>

                </div>


                {/* SALARY */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Basic Salary
                    </label>


                    <input
                      type="number"
                      min="0"
                      value={
                        formData.basicSalary
                      }
                      onChange={(event) =>
                        setFormData(
                          (current) => ({
                            ...current,

                            basicSalary:
                              event.target.value,
                          })
                        )
                      }
                      required
                      className="w-full border border-slate-300 rounded-lg px-4 py-3"
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Allowances
                    </label>


                    <input
                      type="number"
                      min="0"
                      value={
                        formData.allowances
                      }
                      onChange={(event) =>
                        setFormData(
                          (current) => ({
                            ...current,

                            allowances:
                              event.target.value,
                          })
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg px-4 py-3"
                    />

                  </div>


                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Deductions
                    </label>


                    <input
                      type="number"
                      min="0"
                      value={
                        formData.deductions
                      }
                      onChange={(event) =>
                        setFormData(
                          (current) => ({
                            ...current,

                            deductions:
                              event.target.value,
                          })
                        )
                      }
                      className="w-full border border-slate-300 rounded-lg px-4 py-3"
                    />

                  </div>

                </div>


                {/* BUTTONS */}

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
                    Generate Payslip
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>
    );
  }


  // ======================================================
  // EMPLOYEE PAGE
  // ======================================================

  return (
    <div className="animate-fade-in">

      <div className="page-header">

        <h1 className="page-title">
          Payslips
        </h1>

        <p className="page-subtitle">
          Your payslip history
        </p>

      </div>


      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="table-modern">

            <thead>

              <tr>

                <th>
                  Period
                </th>

                <th>
                  Basic Salary
                </th>

                <th>
                  Allowances
                </th>

                <th>
                  Deductions
                </th>

                <th>
                  Net Salary
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {employeePayslips.length > 0 ? (

                employeePayslips.map(
                  (payslip) => (

                    <tr
                      key={
                        payslip._id ||
                        payslip.id
                      }
                    >

                      <td className="text-slate-500">

                        {getPeriod(
                          payslip
                        )}

                      </td>


                      <td className="text-slate-500">

                        {formatMoney(
                          payslip.basicSalary
                        )}

                      </td>


                      <td className="text-slate-500">

                        {formatMoney(
                          payslip.allowances
                        )}

                      </td>


                      <td className="text-slate-500">

                        {formatMoney(
                          payslip.deductions
                        )}

                      </td>


                      <td className="font-semibold text-slate-800">

                        {formatMoney(
                          payslip.netSalary
                        )}

                      </td>


                      <td>

                        <button
                          type="button"
                          onClick={() =>
                            handlePrintPayslip(
                              payslip
                            )
                          }
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-medium"
                        >

                          <Download
                            size={14}
                          />

                          Download

                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center py-10 text-slate-500"
                  >
                    No payslips found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


export default Payslips;