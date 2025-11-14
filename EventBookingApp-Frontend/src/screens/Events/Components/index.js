import React, { useState, useMemo, useEffect, useCallback } from "react";
import EventCard from "../../../common/Components/EventCard";
import Loader from "../../../common/Components/Loader";
import Toast from "../../../common/Components/Toast";
import NoRecordsFound from "./NoRecordsFound";
import ConfirmationModal from "../../../common/Components/ConfirmationModal"; // Import the modal
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "../../../utils";
import { fetchEvents } from "../../Home/Services"; // Import deleteEvent service
import { deleteEvent } from "../Services";

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState("All");
  const [sortBy, setSortBy] = useState("Date");
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [role, setRole] = useState("");

  const getAllEvents = useCallback(async (searchQuery) => {
    setIsLoading(true);
    try {
      const response = await fetchEvents(searchQuery);
      if (response.statusCode === 200) {
        const eventsWithDateObjects = response.data.map((event) => ({
          ...event,
          dateObject: new Date(event.eventDate),
        }));
        setEvents(eventsWithDateObjects);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setSnackbar({
        show: true,
        message: `Failed to fetch events.`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchData = useCallback(
    debounce((search) => {
      getAllEvents(search);
    }, 500),
    [getAllEvents]
  );

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    debouncedFetchData(newSearchTerm);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ show: false, message: "", type: "" });
  };

  const filteredEvents = useMemo(() => {
    let filteredEvent = [...events];
    if (eventType !== "All") {
      filteredEvent = filteredEvent.filter(
        (event) => event.eventType === eventType
      );
    }
    if (sortBy === "Date") {
      filteredEvent.sort((a, b) => a.dateObject - b.dateObject);
    } else if (sortBy === "Price") {
      filteredEvent.sort((a, b) => a.price - b.price);
    }
    return filteredEvent;
  }, [eventType, sortBy, events]);

  const categories = [
    "All",
    ...new Set(events.map((event) => event.eventType)),
  ];

  const handleOpenDeleteModal = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      const response = await deleteEvent(eventToDelete.id);
      if (response.statusCode === 200) {
        setSnackbar({
          show: true,
          message: "Event deleted successfully!",
          type: "success",
        });
        getAllEvents(searchTerm);
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      setSnackbar({
        show: true,
        message: "Failed to delete event.",
        type: "error",
      });
    } finally {
      handleCloseDeleteModal();
    }
  };

  useEffect(() => {
    setRole(localStorage.getItem("role"));
    getAllEvents("");
  }, [getAllEvents]);

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 text-left">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-foreground">All Events</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Discover and book tickets for amazing events happening around you
          </p>
        </header>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <div className="relative w-full max-w-3xl">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-card/50 border border-border rounded-lg pl-11 pr-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div className="relative w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 appearance-none bg-card/50 border border-border rounded-lg pl-4 pr-10 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option>Date</option>
              <option>Price</option>
            </select>
            <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-center flex-wrap gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setEventType(cat)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                eventType === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-muted-foreground mb-6">
          Showing {filteredEvents.length} of {events.length} events
        </p>

        {isLoading ? (
          <Loader />
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onDeleteClick={handleOpenDeleteModal}
                deleteStatus={true}
                role={role}
              />
            ))}
          </div>
        ) : (
          <NoRecordsFound />
        )}

        {snackbar.show && (
          <Toast
            show={snackbar.show}
            message={snackbar.message}
            type={snackbar.type}
            onClose={handleCloseSnackbar}
          />
        )}
      </div>

      {/* Render the Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to permanently delete the event "${eventToDelete?.eventName}"?`}
        confirmText="Yes, Delete Event"
        cancelText="Cancel"
      />
    </>
  );
};

export default EventsPage;
