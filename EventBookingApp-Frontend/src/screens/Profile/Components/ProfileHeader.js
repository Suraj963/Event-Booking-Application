import React from "react";

const ProfileHeader = ({ name, email }) => {
  return (
    <div className="bg-card/50 p-6 rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <img
          src={`https://placehold.co/100x100/4C05FF/FFFFFF?text=${name.charAt(
            0
          )}`}
          alt="User Avatar"
          className="h-24 w-24 rounded-full border-4 border-primary/50 object-cover"
        />
        <div className="text-center sm:text-left flex-grow">
          <h2 className="text-3xl font-bold text-foreground">{name}</h2>
          <p className="text-muted-foreground">{email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
