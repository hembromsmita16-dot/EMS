import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";

const PrintPayslip = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const payslip = location.state?.payslip;

  // ======================================================
  // NO PAYSLIP DATA
  // ======================================================

  if (!payslip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">

        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">

          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Payslip Not Found
          </h2>

          <p className="text-slate-500 mb-5">
            No payslip information was provided.
          </p>

          <button
            type="button"
            onClick={() => navigate("/payslips")}
            className="btn-primary"
          >
            Go Back to Payslips
          </button>

        </div>

      </div>
    );
  }

  // ======================================================
  // PERIOD
  // ======================================================

  const getPeriod = () => {
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
  // EMPLOYEE NAME
  // ======================================================

  const getEmployeeName = () => {
    const employee = Array.isArray(
      payslip.employee
    )
      ? payslip.employee[0]
      : payslip.employee;

    if (!employee) {
      return "Unknown Employee";
    }

    const name =
      `${employee.firstName || ""} ${
        employee.lastName || ""
      }`.trim();

    return name || "Unknown Employee";
  };

  // ======================================================
  // MONEY
  // ======================================================

  const formatMoney = (amount) => {
    return `$${Number(
      amount || 0
    ).toLocaleString()}`;
  };

  // ======================================================
  // PRINT
  // ======================================================

  const handlePrint = () => {
    window.print();
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">

      {/* ==================================================
          TOP BUTTONS
      ================================================== */}

      <div className="max-w-4xl mx-auto mb-5 flex justify-between print:hidden">

        <button
          type="button"
          onClick={() =>
            navigate("/payslips")
          }
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="btn-primary flex items-center gap-2"
        >
          <Printer size={16} />
          Print Payslip
        </button>

      </div>

      {/* ==================================================
          PAYSLIP
      ================================================== */}

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8 print:shadow-none print:border-0">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="text-center border-b border-slate-200 pb-6">

          <h1 className="text-2xl font-bold text-slate-900">
            Employee Management System
          </h1>

          <p className="text-slate-500 mt-1">
            Employee Payslip
          </p>

        </div>

        {/* ==================================================
            EMPLOYEE INFORMATION
        ================================================== */}

        <div className="grid grid-cols-2 gap-6 py-6 border-b border-slate-200">

          <div>

            <p className="text-xs uppercase tracking-wide text-slate-400">
              Employee
            </p>

            <p className="text-base font-semibold text-slate-800 mt-1">
              {getEmployeeName()}
            </p>

          </div>

          <div>

            <p className="text-xs uppercase tracking-wide text-slate-400">
              Pay Period
            </p>

            <p className="text-base font-semibold text-slate-800 mt-1">
              {getPeriod()}
            </p>

          </div>

        </div>

        {/* ==================================================
            SALARY DETAILS
        ================================================== */}

        <div className="py-6">

          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Salary Details
          </h2>

          <div className="border border-slate-200 rounded-lg overflow-hidden">

            {/* BASIC SALARY */}

            <div className="flex justify-between px-5 py-4 border-b border-slate-200">

              <span className="text-slate-600">
                Basic Salary
              </span>

              <span className="font-medium text-slate-800">
                {formatMoney(
                  payslip.basicSalary
                )}
              </span>

            </div>

            {/* ALLOWANCES */}

            <div className="flex justify-between px-5 py-4 border-b border-slate-200">

              <span className="text-slate-600">
                Allowances
              </span>

              <span className="font-medium text-slate-800">
                {formatMoney(
                  payslip.allowances
                )}
              </span>

            </div>

            {/* DEDUCTIONS */}

            <div className="flex justify-between px-5 py-4 border-b border-slate-200">

              <span className="text-slate-600">
                Deductions
              </span>

              <span className="font-medium text-red-500">
                -{formatMoney(
                  payslip.deductions
                )}
              </span>

            </div>

            {/* NET SALARY */}

            <div className="flex justify-between px-5 py-5 bg-slate-50">

              <span className="font-semibold text-slate-800">
                Net Salary
              </span>

              <span className="text-lg font-bold text-slate-900">
                {formatMoney(
                  payslip.netSalary
                )}
              </span>

            </div>

          </div>

        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="border-t border-slate-200 pt-5 text-center">

          <p className="text-xs text-slate-400">
            This is a computer-generated payslip.
          </p>

        </div>

      </div>

    </div>
  );
};

export default PrintPayslip;