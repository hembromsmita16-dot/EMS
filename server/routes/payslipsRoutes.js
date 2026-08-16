import { Router } from "express";

import {
  createPayslip,
  getPayslips,
  getPayslipById,
} from "../controllers/payslipController.js";

import {
  protect,
  protectAdmin,
} from "../middleware/auth.js";


const payslipRouter = Router();


// Admin creates payslip
payslipRouter.post(
  "/",
  protect,
  protectAdmin,
  createPayslip
);


// Admin and employee can view payslips
payslipRouter.get(
  "/",
  protect,
  getPayslips
);


// View individual payslip
payslipRouter.get(
  "/:id",
  protect,
  getPayslipById
);


export default payslipRouter;