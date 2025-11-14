import logo from "./logo.svg";
import "./App.css";
import Navbar from "./layout/Navigation/Navbar";
import Home from "./screens/Home/Components";
import { Link, Outlet, Route, Router, Routes } from "react-router-dom";
import EventsPage from "./screens/Events/Components";
import { Suspense } from "react";
import LoadingSpinner from "./common/Components/LoadingSpinner";
import BookingsPage from "./screens/Bookings/Components";
import ProfilePage from "./screens/Profile/Components";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddEventPage from "./screens/Events/Components/AddEventPage";
import EventDetailsPage from "./screens/Events/Components/EventDetailsPage";
import LoginPage from "./screens/Login/Components/Login";
import SignupPage from "./screens/Login/Components/SignUp";
import { AuthProvider } from "./auth";
import UserListPage from "./screens/Bookings/Components/UserListPage";

const NavbarLayout = () => {
  const role = localStorage.getItem("role");
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "80px" }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>

      {role === "ADMIN" && (
        <Link
          to="/add-event"
          className="fixed bottom-8 right-8 z-50 bg-primary h-14 px-6 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
          title="Add New Event"
        >
          <PlusIcon className="h-6 w-6 text-primary-foreground" />
          <span className="ml-2 font-semibold text-primary-foreground">
            Add Event
          </span>
        </Link>
      )}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<NavbarLayout />}>
          <Route index element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/:userId" element={<BookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-event" element={<AddEventPage />} />
          <Route path="/add-event/:id" element={<AddEventPage />} />
          <Route path="event/:id" element={<EventDetailsPage />} />
          <Route path="/all-users-bookings" element={<UserListPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
