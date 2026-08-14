import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download } from "lucide-react";

import {
  dummyPayslipData,
  dummyProfileData,
} from "../assets/assets";

// ======================================================
// GET PERIOD
// ======================================================

const getPeriod = (payslip) => {
  if (payslip.month && payslip.year) {
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

    const monthIndex =
      Number(payslip.month) - 1;

    return `${months[monthIndex] || ""} ${
      payslip.year
    }`;
  }

  return payslip.period || "—";
};

// ======================================================
// PAYSLIPS
// ======================================================

const Payslips = () => {
  const navigate = useNavigate();

  const role =
    localStorage.getItem("ems_role") || "EMPLOYEE";

  const [payslips, setPayslips] = useState(
    dummyPayslipData || []
  );

  const [showModal, setShowModal] =
    useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    period: "",
    basicSalary: "",
    netSalary: "",
  });

  // ======================================================
  // FORMAT MONEY
  // ======================================================

  const formatMoney = (amount) => {
    return `$${Number(
      amount || 0
    ).toLocaleString()}`;
  };

  // ======================================================
  // GET EMPLOYEE NAME
  // ======================================================

  const getEmployeeName = (payslip) => {
    const employee = Array.isArray(
      payslip.employee
    )
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
    return payslips.filter(
      (payslip) =>
        payslip.employeeId ===
        dummyProfileData._id
    );
  }, [payslips]);

  // ======================================================
  // OPEN PRINT PAYSLIP
  // ======================================================

  const handlePrintPayslip = (payslip) => {
    navigate("/print-payslip", {
      state: {
        payslip,
      },
    });
  };

  // ======================================================
  // GENERATE PAYSLIP - ADMIN
  // ======================================================

  const handleGeneratePayslip = (e) => {
    e.preventDefault();

    if (
      !formData.employeeId ||
      !formData.period ||
      !formData.basicSalary ||
      !formData.netSalary
    ) {
      return;
    }

    const employee =
      payslips.find(
        (item) =>
          item.employeeId ===
          formData.employeeId
      )?.employee || null;

    const newPayslip = {
      _id: `local-${Date.now()}`,

      employeeId:
        formData.employeeId,

      period:
        formData.period,

      basicSalary:
        Number(formData.basicSalary),

      allowances: 0,

      deductions: 0,

      netSalary:
        Number(formData.netSalary),

      employee,
    };

    setPayslips((current) => [
      newPayslip,
      ...current,
    ]);

    setFormData({
      employeeId: "",
      period: "",
      basicSalary: "",
      netSalary: "",
    });

    setShowModal(false);
  };

  // ======================================================
  // ADMIN PAGE
  // ======================================================

  if (role === "ADMIN") {
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
            onClick={() =>
              setShowModal(true)
            }
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
                    Net Salary
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {payslips.length > 0 ? (

                  payslips.map(
                    (payslip) => (

                      <tr
                        key={payslip._id}
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
                      colSpan="5"
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

              <div className="px-6 py-5 border-b border-slate-200">

                <h2 className="text-xl font-semibold text-slate-900">
                  Generate Payslip
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Create a new employee payslip
                </p>

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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        employeeId:
                          e.target.value,
                      })
                    }
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3"
                  >

                    <option value="">
                      Select Employee
                    </option>

                    {[
                      ...new Map(
                        payslips
                          .filter(
                            (item) =>
                              item.employee
                          )
                          .map(
                            (item) => [
                              item.employeeId,
                              item.employee,
                            ]
                          )
                      ).entries(),
                    ].map(
                      ([
                        employeeId,
                        employee,
                      ]) => (

                        <option
                          key={employeeId}
                          value={employeeId}
                        >

                          {employee.firstName}{" "}
                          {employee.lastName}

                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* PERIOD */}

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Period
                  </label>

                  <input
                    type="text"
                    placeholder="February 2026"
                    value={
                      formData.period
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        period:
                          e.target.value,
                      })
                    }
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3"
                  />

                </div>

                {/* SALARY */}

                <div className="grid grid-cols-2 gap-4">

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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          basicSalary:
                            e.target.value,
                        })
                      }
                      required
                      className="w-full border border-slate-300 rounded-lg px-4 py-3"
                    />

                  </div>

                  <div>

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Net Salary
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={
                        formData.netSalary
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          netSalary:
                            e.target.value,
                        })
                      }
                      required
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

      {/* HEADER */}

      <div className="page-header">

        <h1 className="page-title">
          Payslips
        </h1>

        <p className="page-subtitle">
          Your payslip history
        </p>

      </div>

      {/* EMPLOYEE TABLE */}

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
                      key={payslip._id}
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
                    colSpan="4"
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