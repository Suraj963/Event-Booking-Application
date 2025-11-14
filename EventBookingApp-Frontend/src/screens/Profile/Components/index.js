import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import { fetchUser } from "../Services";
import Toast from "../../../common/Components/Toast";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const getUser = async () => {
    try {
      const response = await fetchUser();
      if (response.statusCode === 200) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setSnackbar({
        show: true,
        message: `Failed to fetch`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ show: false, message: "", type: "" });
  };

  useEffect(() => {
    getUser();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!profileData.name || !profileData.email) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-lg text-muted-foreground mt-1">
          Manage your account and notification preferences.
        </p>
      </header>

      <div className="space-y-8">
        <ProfileHeader name={profileData.name} email={profileData.email} />
        <ProfileForm
          profileData={profileData}
          setProfileData={setProfileData}
        />
      </div>
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
export default ProfilePage;
