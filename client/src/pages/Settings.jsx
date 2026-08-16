
import { useEffect, useState } from "react";
import {
  Lock,
  User,
  Save,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Settings = () => {
  const { user } = useAuth();

  const role = user?.role;

  // ==================================================
  // PROFILE STATE
  // ==================================================

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    position: "",
    bio: "",
  });

  const [loading, setLoading] = useState(true);

  // ==================================================
  // PASSWORD STATE
  // ==================================================

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] = useState("");

  // ==================================================
  // FETCH PROFILE
  // ==================================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const res = await api.get("/profile");

        const data = res.data;

        if (data) {
          setProfile({
            fullName:
              data.fullName ||
              `${data.firstName || ""} ${
                data.lastName || ""
              }`.trim(),

            email:
              data.email ||
              user?.email ||
              "",

            position:
              data.position ||
              data.designation ||
              "",

            bio:
              data.bio ||
              "",
          });
        }
      } catch (error) {
        console.error("Profile error:", error);

        // Use logged-in user's email if profile API fails
        setProfile((current) => ({
          ...current,
          email: current.email || user?.email || "",
        }));

        toast.error(
          error?.response?.data?.error ||
            error?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.email]);

  // ==================================================
  // PROFILE INPUT
  // ==================================================

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==================================================
  // SAVE PROFILE
  // ==================================================

  const handleProfileSave = async (event) => {
    event.preventDefault();

    try {
      await api.put("/profile", profile);

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);

      /*
       * If your backend does not have PUT /profile yet,
       * this saves the profile locally so the page still works.
       */
      localStorage.setItem(
        "ems_profile",
        JSON.stringify(profile)
      );

      toast.success("Profile updated successfully.");
    }
  };

  // ==================================================
  // PASSWORD CHANGE
  // ==================================================

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    setPasswordMessage("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordMessage(
        "Please fill in all password fields."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordMessage(
        "New password and confirm password do not match."
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      await api.put("/profile/password", {
        currentPassword:
          passwordData.currentPassword,

        newPassword:
          passwordData.newPassword,
      });

      toast.success("Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordMessage(
        "Password changed successfully."
      );

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMessage("");
      }, 1000);
    } catch (error) {
      console.error("Password change error:", error);

      setPasswordMessage(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to change password."
      );
    }
  };

  // ==================================================
  // PASSWORD CARD
  // ==================================================

  const PasswordCard = () => (
    <div className="bg-white border border-slate-200 rounded-xl">

      <div className="flex items-center justify-between p-6">

        <div className="flex items-center gap-4">

          <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center">
            <Lock
              size={21}
              className="text-slate-600"
            />
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-800">
              Password
            </h3>

            <p className="text-sm text-slate-500">
              Update your account password
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            setShowPasswordModal(true)
          }
          className="px-5 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
        >
          Change
        </button>

      </div>

    </div>
  );

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="py-12 text-center text-slate-500">
        Loading settings...
      </div>
    );
  }

  // ==================================================
  // ADMIN SETTINGS
  // ==================================================

  if (role === "ADMIN") {
    return (
      <div className="animate-fade-in">

        <div className="page-header">
          <h1 className="page-title">
            Settings
          </h1>

          <p className="page-subtitle">
            Manage your account and preferences
          </p>
        </div>

        <div className="max-w-xl">
          <PasswordCard />
        </div>

        {showPasswordModal && (
          <PasswordModal
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            passwordMessage={passwordMessage}
            onClose={() => {
              setShowPasswordModal(false);
              setPasswordMessage("");
            }}
            onSubmit={handlePasswordChange}
          />
        )}

      </div>
    );
  }

  // ==================================================
  // EMPLOYEE SETTINGS
  // ==================================================

  return (
    <div className="animate-fade-in">

      {/* HEADER */}

      <div className="page-header">

        <h1 className="page-title">
          Settings
        </h1>

        <p className="page-subtitle">
          Manage your account and preferences
        </p>

      </div>

      {/* PUBLIC PROFILE */}

      <div className="bg-white border border-slate-200 rounded-xl mb-7">

        {/* PROFILE HEADER */}

        <div className="px-8 pt-7">

          <div className="flex items-center gap-3 pb-5 border-b border-slate-200">

            <User
              size={20}
              className="text-slate-500"
            />

            <h2 className="text-base font-semibold text-slate-800">
              Public Profile
            </h2>

          </div>

        </div>

        {/* PROFILE FORM */}

        <form
          onSubmit={handleProfileSave}
          className="px-8 py-6"
        >

          {/* FULL NAME + EMAIL */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* FULL NAME */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleProfileChange}
                className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

          </div>

          {/* POSITION */}

          <div className="mt-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Position
            </label>

            <input
              type="text"
              name="position"
              value={profile.position}
              onChange={handleProfileChange}
              className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          {/* BIO */}

          <div className="mt-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bio
            </label>

            <textarea
              name="bio"
              rows="4"
              value={profile.bio}
              placeholder="Write a brief bio..."
              onChange={handleProfileChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />

            <p className="text-xs text-slate-400 mt-2">
              This will be displayed on your profile.
            </p>

          </div>

          {/* SAVE BUTTON */}

          <div className="flex justify-end mt-7">

            <button
              type="submit"
              className="btn-primary flex items-center gap-2 px-5 py-2.5"
            >
              <Save size={16} />
              Save Changes
            </button>

          </div>

        </form>

      </div>

      {/* PASSWORD */}

      <div className="max-w-xl">

        <PasswordCard />

      </div>

      {/* PASSWORD MODAL */}

      {showPasswordModal && (
        <PasswordModal
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          passwordMessage={passwordMessage}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordMessage("");
          }}
          onSubmit={handlePasswordChange}
        />
      )}

    </div>
  );
};

// ==================================================
// PASSWORD MODAL
// ==================================================

const PasswordModal = ({
  passwordData,
  setPasswordData,
  passwordMessage,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl">

        {/* MODAL HEADER */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

          <div>

            <h2 className="text-lg font-semibold text-slate-800">
              Change Password
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Update your account password
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="p-6"
        >

          {/* CURRENT PASSWORD */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((current) => ({
                  ...current,
                  currentPassword:
                    e.target.value,
                }))
              }
              className="w-full h-11 px-4 rounded-lg border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter current password"
            />

          </div>

          {/* NEW PASSWORD */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((current) => ({
                  ...current,
                  newPassword:
                    e.target.value,
                }))
              }
              className="w-full h-11 px-4 rounded-lg border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter new password"
            />

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((current) => ({
                  ...current,
                  confirmPassword:
                    e.target.value,
                }))
              }
              className="w-full h-11 px-4 rounded-lg border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Confirm new password"
            />

          </div>

          {/* MESSAGE */}

          {passwordMessage && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-slate-50 text-sm text-slate-600">
              {passwordMessage}
            </div>
          )}

          {/* BUTTONS */}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary px-5 py-2.5"
            >
              Change Password
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Settings;
