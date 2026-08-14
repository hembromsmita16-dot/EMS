import { useState } from "react";
import {
  Lock,
  User,
  Save,
  X,
} from "lucide-react";

import { dummyProfileData } from "../assets/assets";

const Settings = () => {
  const role =
    localStorage.getItem("ems_role") || "EMPLOYEE";

  // --------------------------------------------------
  // EMPLOYEE PROFILE DATA
  // --------------------------------------------------

  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    position: "Senior Software Developer",
    bio: "Hi, I am dev a full stack web developer",
  });

  // --------------------------------------------------
  // PASSWORD MODAL
  // --------------------------------------------------

  const [showPasswordModal, setShowPasswordModal] =
    useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordMessage, setPasswordMessage] =
    useState("");

  // --------------------------------------------------
  // SAVE PROFILE
  // --------------------------------------------------

  const handleProfileSave = (e) => {
    e.preventDefault();

    // Save locally for this demo
    localStorage.setItem(
      "ems_profile",
      JSON.stringify(profile)
    );

    alert("Profile updated successfully.");
  };

  // --------------------------------------------------
  // PASSWORD CHANGE
  // --------------------------------------------------

  const handlePasswordChange = (e) => {
    e.preventDefault();

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

    // Demo only — store locally
    localStorage.setItem(
      "ems_password_changed",
      "true"
    );

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
    }, 1200);
  };

  // ==================================================
  // PASSWORD CARD
  // ==================================================

  const PasswordCard = () => (
    <div className="bg-white border border-slate-200 rounded-xl">

      <div className="flex items-center justify-between p-6">

        <div className="flex items-center gap-4">

          {/* Icon */}
          <div className="w-11 h-11 rounded-lg bg-slate-100 flex items-center justify-center">
            <Lock
              size={21}
              className="text-slate-600"
            />
          </div>

          {/* Text */}
          <div>

            <h3 className="text-base font-semibold text-slate-800">
              Password
            </h3>

            <p className="text-sm text-slate-500">
              Update your account password
            </p>

          </div>

        </div>

        {/* Change Button */}
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
  // ADMIN SETTINGS
  // ==================================================

  if (role === "ADMIN") {
    return (
      <div className="animate-fade-in">

        {/* Header */}
        <div className="page-header">

          <h1 className="page-title">
            Settings
          </h1>

          <p className="page-subtitle">
            Manage your account and preferences
          </p>

        </div>

        {/* Password */}
        <div className="max-w-xl">

          <PasswordCard />

        </div>

        {/* Password Modal */}
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

      {/* Header */}
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

        {/* Profile Header */}
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

        {/* Profile Form */}
        <form
          onSubmit={handleProfileSave}
          className="px-8 py-6"
        >

          {/* Full Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Full Name */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    fullName: e.target.value,
                  })
                }
                className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

            {/* Email */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email: e.target.value,
                  })
                }
                className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />

            </div>

          </div>

          {/* Position */}
          <div className="mt-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Position
            </label>

            <input
              type="text"
              value={profile.position}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  position: e.target.value,
                })
              }
              className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />

          </div>

          {/* Bio */}
          <div className="mt-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Bio
            </label>

            <textarea
              rows="4"
              value={profile.bio}
              placeholder="Write a brief bio..."
              onChange={(e) =>
                setProfile({
                  ...profile,
                  bio: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />

            <p className="text-xs text-slate-400 mt-2">
              This will be displayed on your profile.
            </p>

          </div>

          {/* Save Button */}
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
// PASSWORD MODAL COMPONENT
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

        {/* Modal Header */}
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

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="p-6"
        >

          {/* Current Password */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={
                passwordData.currentPassword
              }
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword:
                    e.target.value,
                })
              }
              className="w-full h-11 px-4 rounded-lg border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter current password"
            />

          </div>

          {/* New Password */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={
                passwordData.newPassword
              }
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword:
                    e.target.value,
                })
              }
              className="w-full h-11 px-4 rounded-lg border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Enter new password"
            />

          </div>

          {/* Confirm Password */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm New Password
            </label>

            <input
              type="password"
              value={
                passwordData.confirmPassword
              }
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword:
                    e.target.value,
                })
              }
              className="w-full h-11 px-4 rounded-lg border border-slate-200 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              placeholder="Confirm new password"
            />

          </div>

          {/* Message */}
          {passwordMessage && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-slate-50 text-sm text-slate-600">
              {passwordMessage}
            </div>
          )}

          {/* Buttons */}
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