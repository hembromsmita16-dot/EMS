import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginForm = ({ role, title, subtitle }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email, password, role);

      localStorage.setItem(
        "ems_role",
        role.toUpperCase()
      );

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.error ||
        error.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl">

        <Link
          to="/login"
          className="text-sm text-slate-500 hover:text-indigo-600"
        >
          ← Back
        </Link>

        <div className="mt-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {title}
          </h1>

          <p className="mt-2 text-slate-500">
            {subtitle}
          </p>
        </div>

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter email"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-lg font-medium"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {role === "admin"
            ? "Admin Access"
            : "Employee Access"}
        </p>

      </div>
    </div>
  );
};

export default LoginForm;