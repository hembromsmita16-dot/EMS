import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import LoginLanding from "./pages/LoginLanding";
import LoginForm from "./components/LoginForm";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <>
      <Toaster />

      <Routes>
        {/* Login */}
        <Route path="/login" element={<LoginLanding />} />

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

        {/* Application Pages */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/employees"
            element={<h1 className="text-3xl font-bold">Employees</h1>}
          />

          <Route
            path="/attendance"
            element={<h1 className="text-3xl font-bold">Attendance</h1>}
          />

          <Route
            path="/leave"
            element={<h1 className="text-3xl font-bold">Leave</h1>}
          />

          <Route
            path="/payslips"
            element={<h1 className="text-3xl font-bold">Payslips</h1>}
          />

          <Route
            path="/settings"
            element={<h1 className="text-3xl font-bold">Settings</h1>}
          />

          <Route
            path="/print/payslips/:id"
            element={<h1 className="text-3xl font-bold">Print Payslip</h1>}
          />
        </Route>

        {/* Root URL → Dashboard */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Unknown URL → Dashboard */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </>
  );
};

export default App;