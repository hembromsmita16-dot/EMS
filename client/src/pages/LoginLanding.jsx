import { Link, Navigate } from "react-router-dom";
import LoginLeftSide from "../components/LoginLeftSide";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const LoginLanding = () => {
  const {user, loading} = useAuth()

    if(loading) return <Loading />
    if(user) return <Navigate to="/"/>
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <LoginLeftSide />

      <div className="flex-1 min-h-screen flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome to EMS
          </h2>

          <p className="mt-2 mb-8 text-slate-500">
            Select your portal to continue.
          </p>

          <div className="space-y-4">
            <Link
              to="/login/admin"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-4 rounded-xl font-medium"
            >
              Admin Portal
            </Link>

            <Link
              to="/login/employee"
              className="block w-full border border-slate-300 hover:bg-slate-50 text-slate-700 text-center py-4 rounded-xl font-medium"
            >
              Employee Portal
            </Link>
          </div>
          <div>
            <p>© {new Date().getFullYear()} GreatStack. All Rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLanding;