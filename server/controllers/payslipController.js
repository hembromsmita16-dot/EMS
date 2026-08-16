import Employee from "../models/Employee.js";
import Payslip from "../models/Payslip.js";

// ======================================================
// CREATE PAYSLIP
// POST /api/payslips
// ======================================================

export const createPayslip = async (req, res) => {
  try {
    const {
      employeeId,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
    } = req.body;

    if (
      !employeeId ||
      !month ||
      !year ||
      basicSalary === undefined
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    if (employee.isDeleted) {
      return res.status(400).json({
        error: "Cannot create payslip for inactive employee",
      });
    }

    const basic = Number(basicSalary);
    const allowance = Number(allowances || 0);
    const deduction = Number(deductions || 0);

    const netSalary = basic + allowance - deduction;

    const payslip = await Payslip.create({
      employeeId,
      month: Number(month),
      year: Number(year),
      basicSalary: basic,
      allowances: allowance,
      deductions: deduction,
      netSalary,
    });

    return res.status(201).json({
      success: true,
      data: payslip,
    });
  } catch (error) {
    console.error("Create Payslip Error:", error);

    return res.status(500).json({
      error: "Failed to create payslip",
    });
  }
};


// ======================================================
// GET ALL / EMPLOYEE PAYSLIPS
// GET /api/payslips
// ======================================================

export const getPayslips = async (req, res) => {
  try {
    const session = req.session;

    const isAdmin = session.role === "ADMIN";

    // ---------------- ADMIN ----------------

    if (isAdmin) {
      const payslips = await Payslip.find()
        .populate("employeeId")
        .sort({ year: -1, month: -1, createdAt: -1 });

      const data = payslips.map((payslip) => {
        const obj = payslip.toObject();

        return {
          ...obj,
          id: obj._id.toString(),

          employee: obj.employeeId,

          employeeId: obj.employeeId?._id
            ? obj.employeeId._id.toString()
            : null,
        };
      });

      return res.json({
        data,
      });
    }

    // ---------------- EMPLOYEE ----------------

    const employee = await Employee.findOne({
      userId: session.userId,
    });

    if (!employee) {
      return res.status(404).json({
        error: "Employee not found",
      });
    }

    const payslips = await Payslip.find({
      employeeId: employee._id,
    }).sort({
      year: -1,
      month: -1,
      createdAt: -1,
    });

    return res.json({
      data: payslips,
    });
  } catch (error) {
    console.error("Get Payslips Error:", error);

    return res.status(500).json({
      error: "Failed to fetch payslips",
    });
  }
};


// ======================================================
// GET PAYSLIP BY ID
// GET /api/payslips/:id
// ======================================================

export const getPayslipById = async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id)
      .populate("employeeId")
      .lean();

    if (!payslip) {
      return res.status(404).json({
        error: "Payslip not found",
      });
    }

    return res.json({
      ...payslip,
      id: payslip._id.toString(),
      employee: payslip.employeeId,
      employeeId: payslip.employeeId?._id
        ? payslip.employeeId._id.toString()
        : null,
    });
  } catch (error) {
    console.error("Get Payslip Error:", error);

    return res.status(500).json({
      error: "Failed to fetch payslip",
    });
  }
};