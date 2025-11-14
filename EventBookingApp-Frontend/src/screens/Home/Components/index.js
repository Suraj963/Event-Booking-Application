import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  StarIcon,
  MapPinIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import CountCard from "../../../common/Components/CountCard";
import EventCard from "../../../common/Components/EventCard";
import { fetchEvents, getStatistics } from "../Services";
import Toast from "../../../common/Components/Toast";

const Home = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [count, setCount] = useState({});
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [role, setRole] = useState("");

  const stats = [
    { icon: <CalendarIcon />, count: count.totalEvents, label: "Total Events" },
    {
      icon: <StarIcon />,
      count: count.totalCustomers,
      label: "Happy Customers",
    },
    { icon: <MapPinIcon />, count: count.totalCities, label: "Cities Covered" },
    {
      icon: <ChartBarIcon />,
      count: count.eventsThisMonth,
      label: "Events This Month",
    },
  ];

  const getAllEvents = async () => {
    try {
      const response = await fetchEvents();
      if (response.statusCode === 200) {
        setEvents(response.data);
      }
    } catch (error) {
      setSnackbar({
        show: true,
        message: `Failed to fetch`,
        type: "error",
      });
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getStatistics();
      if (response.statusCode === 200) {
        setCount(response.data);
      }
    } catch (error) {
      setSnackbar({
        show: true,
        message: `Failed to fetch`,
        type: "error",
      });
    }
  };

  const handleSearchSubmit = (e) => {
    navigate("/events");
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ show: false, message: "", type: "" });
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    fetchStatistics();
    getAllEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 pt-20 pb-16 md:pt-20 md:pb-24 text-center">
      {/* === Header Section === */}
      <header className="mb-12">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
          Welcome to <span className="text-primary">Eventify</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Book Your Tickets Easily – Discover amazing events, connect with
          like-minded people, and create unforgettable memories
        </p>
      </header>

      {/* === Search Bar  === */}
      <div className="max-w-3xl mx-auto mb-12">
        <form className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events by name, location, or category..."
              className="w-full bg-card/50 border border-border rounded-lg pl-11 pr-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-shadow duration-300"
            />
          </div>
          <button
            type="button"
            onClick={handleSearchSubmit}
            className="w-full sm:w-auto bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-colors duration-300 flex-shrink-0"
          >
            Search Events
          </button>
        </form>
      </div>

      {/* === Stats Grid Section === */}
      <div className="max-w-5xl mx-auto mb-16">
        <hr className="border-border mb-16" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <CountCard
              key={stat.label}
              icon={stat.icon}
              count={stat.count}
              label={stat.label}
            />
          ))}
        </div>
      </div>

      {/* === Featured Events Section === */}
      <div className="py-16">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Featured Events
        </h2>
        <p className="text-lg text-muted-foreground mb-12">
          Don't miss out on these popular events happening near you
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              deleteStatus={false}
              role={role}
            />
          ))}
        </div>

        <Link
          to="/events"
          className="inline-block bg-transparent border-2 border-primary text-primary font-bold py-3 px-10 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
        >
          View All Events
        </Link>
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

export default Home;
