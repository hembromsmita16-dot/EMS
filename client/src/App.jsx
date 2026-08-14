import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import LoginLanding from "./pages/LoginLanding";
import LoginForm from "./components/LoginForm";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payslips from "./pages/Payslips";
import Settings from "./pages/Settings";
import PrintPayslip from "./pages/PrintPayslip";

const App = () => {
  return (
    <>
      <Toaster />

      <Routes>

        {/* =====================================================
            LOGIN
        ===================================================== */}

        <Route
          path="/login"
          element={<LoginLanding />}
        />

        <Route
          path="/login/admin"
          element={
            <LoginForm
              role="admin"
              title="Admin Portal"
              subtitle="Sign in to manage the organization"
            />
          }
        />

        <Route
          path="/login/employee"
          element={
            <LoginForm
              role="employee"
              title="Employee Portal"
              subtitle="Sign in to access your employee account"
            />
          }
        />

        {/* =====================================================
            MAIN APPLICATION
        ===================================================== */}

        <Route element={<Layout />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Employees */}
          <Route
            path="/employees"
            element={<Employees />}
          />

          {/* Attendance */}
          <Route
            path="/attendance"
            element={<Attendance />}
          />

          {/* Leave */}
          <Route
            path="/leave"
            element={<Leave />}
          />

          {/* Payslips */}
          <Route
            path="/payslips"
            element={<Payslips />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

        {/* =====================================================
            PRINT PAYSLIP
            This is outside Layout so the payslip prints cleanly
        ===================================================== */}

        <Route
          path="/print-payslip"
          element={<PrintPayslip />}
        />

        {/* =====================================================
            DEFAULT ROUTES
        ===================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </>
  );
};

export default App;