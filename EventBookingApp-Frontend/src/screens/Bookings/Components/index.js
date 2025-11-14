import React, { useState, useMemo, useEffect } from "react";
import GenerateTicketPdf from "./TicketGenerator";
import ConfirmationModal from "../../../common/Components/ConfirmationModal";

import {
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import BookingsCount from "../../../common/Components/BookingsCount";
import { cancelBooking, fetchUserBookings } from "../Services";
import Loader from "../../../common/Components/Loader";
import Toast from "../../../common/Components/Toast";
import { useParams } from "react-router-dom";
import { FormatApiDateTime } from "../../../utils/FormatDateAndTime";
import BookingHistoryTable from "./BookingHistoryTable";

const BookingsPage = () => {
  const { userId } = useParams();
  const [activeFilter, setActiveFilter] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

    const role = localStorage.getItem("role");
    const data = {
      role: role,
      userId,
    };

  const formatApiStatus = (status) => {
    if (status === "BOOKED") return "Confirmed";
    if (status === "CANCELLED") return "Cancelled";
    return status;
  };

  const handleDownloadTicket = (booking) => {
    GenerateTicketPdf(booking);
  };

  const handleOpenCancelModal = (booking) => {
    setBookingToCancel(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBookingToCancel(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ show: false, message: "", type: "" });
  };

  const getUserBookings = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetchUserBookings(data);
      if (response.statusCode === 200) {
        const transformedData = response.data.map((item) => ({
          id: item.booking.id,
          event: item.event.eventName,
          bookedOn: new Date(item.event.createdAt).toLocaleDateString("en-GB"),
          date: FormatApiDateTime(item.event.eventDate, item.event.eventTime),
          dateObject: new Date(item.event.eventDate),
          location: item.event.location,
          seats: item.booking.seatsBooked,
          amount: item.booking.totalAmount,
          status: formatApiStatus(item.booking.status),
        }));
        setBookings(transformedData);
      }
    } catch (error) {
      console.error("Failed to fetch user bookings:", error);
      setSnackbar({
        show: true,
        message: `Failed to fetch bookings.`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const upcomingEvents = bookings.filter(
      (b) => b.dateObject > new Date() && b.status !== "Cancelled"
    ).length;
    const totalSpent = bookings
      .filter((b) => b.status !== "Cancelled")
      .reduce((sum, b) => sum + b.amount, 0);
    return { totalBookings, upcomingEvents, totalSpent };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    if (activeFilter === "All") return bookings;
    return bookings.filter((b) => b.status === activeFilter);
  }, [activeFilter, bookings]);

  const filterCounts = useMemo(
    () => ({
      All: bookings.length,
      Confirmed: bookings.filter((b) => b.status === "Confirmed").length,
      Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    }),
    [bookings]
  );

  const handleConfirmCancel = async () => {
    try {
      const response = await cancelBooking(bookingToCancel.id);
      if (response.statusCode === 200) {
        setSnackbar({
          show: true,
          message: `Booking cancelled successfully!`,
          type: "success",
        });
        setTimeout(() => {
          getUserBookings(data);
        }, 2000);
      } else {
        setSnackbar({
          show: true,
          message: `Failed to cancel booking, Please try again!`,
          type: "error",
        });
      }
      handleCloseModal();
      getUserBookings(data);
    } catch (error) {
      setSnackbar({
        show: true,
        message: `Failed to cancel booking, Please try again!`,
        type: "error",
      });
      setTimeout(() => {
        getUserBookings();
      }, 2000);
      handleCloseModal();
    } finally {
      handleCloseModal();
    }
  };

  
  useEffect(() => {
    getUserBookings(data);
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 text-left">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-foreground">My Bookings</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage your event tickets and view booking history
          </p>
        </header>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <BookingsCount
                icon={<CalendarDaysIcon />}
                count={stats.totalBookings.toString()}
                label="Total Bookings"
                color="primary"
              />
              <BookingsCount
                icon={<ClockIcon />}
                count={stats.upcomingEvents.toString()}
                label="Upcoming Events"
                color="green-500"
              />
              <BookingsCount
                icon={<CurrencyDollarIcon />}
                count={`₹${stats.totalSpent.toFixed(2)}`}
                label="Total Spent"
                color="blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-card/50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2">
                <FunnelIcon className="h-5 w-5 text-muted-foreground hidden sm:block" />
                <span className="text-sm font-semibold text-foreground mr-2 hidden sm:block">
                  Filter by:
                </span>
                {Object.entries(filterCounts).map(([filter, count]) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      activeFilter === filter
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {filter}{" "}
                    <span className="ml-1.5 bg-background/50 text-xs px-1.5 py-0.5 rounded-full">
                      {count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <BookingHistoryTable
              bookings={filteredBookings}
              onDownloadTicket={handleDownloadTicket}
              onCancel={handleOpenCancelModal}
            />
          </>
        )}

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

      {/*Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmCancel}
        title="Confirm Cancellation"
        message={`Are you sure you want to cancel your booking for "${bookingToCancel?.event}"? This action cannot be undone.`}
        confirmText="Yes, Cancel Booking"
        cancelText="No, Keep It"
      />
    </>
  );
};

export default BookingsPage;
