import React, { useState } from "react";
import { updateNewPassword } from "../Services";
import Toast from "../../../common/Components/Toast";
import InputField from "./InputField";

const ProfileForm = ({ profileData, setProfileData }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ show: false, message: "", type: "" });
  };

  const updatePassword = async () => {
    if (!currentPassword || !newPassword) {
      setSnackbar({
        show: true,
        message: "Please fill in both password fields",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 6) {
      setSnackbar({
        show: true,
        message: "New password must be at least 6 characters long",
        type: "error",
      });
      return;
    }

    const passwords = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    try {
      const response = await updateNewPassword(passwords);

      if (response.statusCode === 200) {
        setSnackbar({
          show: true,
          message: "Password updated successfully",
          type: "success",
        });
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (error) {
      if (error.response.data.statusCode === 401) {
        setSnackbar({
          show: true,
          message: error.response.data.message,
          type: "error",
        });
      } else {
        setSnackbar({
          show: true,
          message: "Failed to update password. Please try again.",
          type: "error",
        });
      }
    }
  };

  return (
    <div className="bg-card/50 p-6 rounded-2xl">
      <h3 className="text-xl font-bold text-foreground mb-6">
        Personal Information
      </h3>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Full Name"
            id="name"
            type="text"
            value={profileData.name}
            onChange={(e) =>
              setProfileData({ ...profileData, name: e.target.value })
            }
          />
          <InputField
            label="Email Address"
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) =>
              setProfileData({ ...profileData, email: e.target.value })
            }
            readOnly={true}
          />
        </div>
        <InputField
          label="Phone Number"
          id="phone"
          type="tel"
          value={profileData.phone}
          onChange={(e) =>
            setProfileData({ ...profileData, phone: e.target.value })
          }
          readOnly={true}
        />

        {/* Change Password Section */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Change Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Current Password"
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <InputField
              label="New Password"
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={updatePassword}
            className="bg-primary text-primary-foreground font-bold py-2.5 px-6 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
      {snackbar.show && (
        <Toast
          show={snackbar.show}
          message={snackbar.message}
          type={snackbar.type}
          onClose={handleCloseSnackbar}
        />
      )}
    </div>
  );
};

export default ProfileForm;
