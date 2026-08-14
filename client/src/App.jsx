import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";

import LoginLanding from "./pages/LoginLanding";
import LoginForm from "./components/LoginForm";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";

const App = () => {
  return (
    <>
      <Toaster />

      <Routes>

        {/* ================= LOGIN ================= */}

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

        {/* ================= MAIN APPLICATION ================= */}

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
            element={
              <h1 className="text-3xl font-bold">
                Attendance
              </h1>
            }
          />

          {/* Leave */}
          <Route
            path="/leave"
            element={
              <h1 className="text-3xl font-bold">
                Leave
              </h1>
            }
          />

          {/* Payslips */}
          <Route
            path="/payslips"
            element={
              <h1 className="text-3xl font-bold">
                Payslips
              </h1>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <h1 className="text-3xl font-bold">
                Settings
              </h1>
            }
          />

          {/* Print Payslip */}
          <Route
            path="/print/payslips/:id"
            element={
              <h1 className="text-3xl font-bold">
                Print Payslip
              </h1>
            }
          />

        </Route>

        {/* ================= REDIRECTS ================= */}

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