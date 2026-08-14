import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = ({ role, title, subtitle }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    localStorage.setItem(
  "ems_role",
  role.toUpperCase()
);

navigate("/dashboard");
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
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>

          <p className="mt-2 text-slate-500">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {role === "admin" ? "Admin Access" : "Employee Access"}
        </p>
      </div>
    </div>
  );
};

export default LoginForm;