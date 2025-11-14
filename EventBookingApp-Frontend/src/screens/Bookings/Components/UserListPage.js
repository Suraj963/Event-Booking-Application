import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { fetchAllUsers } from "../Services";
import { FormatDate } from "../../../utils/FormatDateAndTime";
import { debounce } from "../../../utils";
import Toast from "../../../common/Components/Toast";
import Loader from "../../../common/Components/Loader";

const UserListPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const getAllUsers = async (searchTerm) => {
    try {
      const response = await fetchAllUsers(searchTerm);
      if (response.statusCode === 200) {
        setUsers(response.data);
      }
    } catch (error) {
      setSnackbar({
        show: true,
        message: `Failed to fetch`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // DEBOUNCE FUNCTIONLAITY FOR SEARCHING
  const debouncedFetchData = useCallback(
    debounce((search) => {
      getAllUsers(search);
    }, 500),
    []
  );

  //  SEARCH CHANGE FUNCTIONALITY
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    debouncedFetchData(newSearchTerm);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ show: false, message: "", type: "" });
  };

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedTerm) ||
        user.email.toLowerCase().includes(lowercasedTerm) ||
        user.phone.includes(searchTerm)
    );
  }, [users, searchTerm]);

  const handleViewBookings = (userId) => {
    navigate(`/bookings/${userId}`);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground">User Management</h1>
        <p className="text-lg text-muted-foreground mt-1">
          Search, view, and manage all registered users.
        </p>
      </header>

      <div className="flex justify-center mb-8">
        <div className="relative w-full max-w-xl">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-card/50 border border-border rounded-lg pl-11 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-semibold text-foreground">All Users</h2>
          <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1 ? "User" : "Users"}
          </span>
        </div>

        <div className="space-y-3">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-card/80 rounded-lg p-4 transition-all duration-300 ring-1 ring-transparent hover:ring-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:bg-card"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`https://placehold.co/48x48/4C05FF/FFFFFF?text=${user.name.charAt(
                        0
                      )}`}
                      alt="avatar"
                      className="h-12 w-12 rounded-full flex-shrink-0"
                    />
                    <div>
                      <p className="font-bold text-lg text-foreground">
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        {user.email}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                        {user.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:space-x-8 w-full sm:w-auto">
                    <div className="text-sm text-muted-foreground">
                      <p className="sm:hidden font-semibold text-foreground text-xs">
                        JOINED ON
                      </p>
                      {FormatDate(user.createdAt)}
                    </div>
                    <button
                      onClick={() => handleViewBookings(user.id)}
                      className="border border-primary text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <span>View Bookings</span>
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-card/50 rounded-lg p-12 text-center text-muted-foreground">
              <UsersIcon className="mx-auto h-12 w-12" />
              <p className="mt-4 font-semibold">No users found</p>
              <p className="text-sm">
                No users matched your search term "{searchTerm}".
              </p>
            </div>
          )}
        </div>
      </div>
      {/* SNACKBAR */}
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

export default UserListPage;
