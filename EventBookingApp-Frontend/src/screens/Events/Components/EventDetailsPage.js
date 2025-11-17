import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { convertTo12Hour, FormatDate } from "../../../utils/FormatDateAndTime";
import { API_URI } from "../../../common/Components";
import { eventBooking, fetchEventById } from "../Services";
import Toast from "../../../common/Components/Toast";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState([]);
  const [seatCount, setSeatCount] = useState(1);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const getEventById = async () => {
    try {
      const response = await fetchEventById(id);
      if (response.statusCode === 200) {
        setEvent(response.data);
      }
    } catch (error) {
      setSnackbar({
        show: true,
        message: "Failed to fetch",
        type: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ show: false, message: "", type: "" });
  };

  const bookEvent = async (paymentId) => {
    const data = {
      eventId: id,
      paymentId,
      seatsBooked: seatCount,
    };

    try {
      const response = await eventBooking(data);
      if (response.statusCode === 200) {
        setBookingStatus("success");
      }
    } catch (error) {
      console.log(error);
      setSnackbar({
        show: true,
        message: "Booking failed",
        type: "error",
      });
    }
  };

  const handlePayment = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({
        show: true,
        message: `Please Login to Book an Event!`,
        type: "error",
      });
      return;
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // Dummy test key
      amount: event.price * seatCount * 100, // Amount in rupees
      currency: "INR",
      name: "Golden Occasions",
      description: `Booking for ${event.eventName} (x${seatCount} seats)`,
      handler: (response) => {
        bookEvent(response.razorpay_payment_id);
      },
      prefill: {
        name: "Golden Occasions",
        email: "surajgm6042@gmail.com",
        contact: "9999999999",
      },
      theme: { color: "#160935ff" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    if (id) {
      getEventById();
    }
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Column: Image */}
          <div className="lg:col-span-3">
            <img
              src={`${event.image}`}
              alt={event.eventName}
              className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Right Column: Details and Booking */}
          <div className="lg:col-span-2">
            <span className="bg-primary/20 text-primary text-sm font-semibold px-4 py-1.5 rounded-full">
              {event.eventType}
            </span>
            <h1 className="text-4xl font-bold text-foreground my-4">
              {event.eventName}
            </h1>

            <div className="space-y-3 text-muted-foreground mb-6">
              <p className="flex items-center text-lg">
                <CalendarIcon className="h-5 w-5 mr-3 text-primary" />{" "}
                {FormatDate(event.eventDate)}
              </p>
              <p className="flex items-center text-lg">
                <CalendarIcon className="h-5 w-5 mr-3 text-primary" />{" "}
                {convertTo12Hour(event.eventTime)}
              </p>
              <p className="flex items-center text-lg">
                <MapPinIcon className="h-5 w-5 mr-3 text-primary" />{" "}
                {event.location}
              </p>
              <p className="flex items-center text-lg text-yellow-400 font-semibold">
                <TicketIcon className="h-5 w-5 mr-3" /> {event.availableSeats}{" "}
                seats available
              </p>
            </div>

            <p className="text-foreground/80 mb-8">{event.description}</p>

            {/* Booking Section */}
            <div className="bg-card/50 p-6 rounded-2xl space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">
                  Select Seats
                </span>
                <div className="flex items-center gap-4 bg-input rounded-lg p-1">
                  <button
                    onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                    className="text-foreground p-1.5 rounded-md hover:bg-muted"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                  <span className="font-bold text-lg text-foreground w-8 text-center">
                    {seatCount}
                  </span>
                  <button
                    onClick={() => setSeatCount(seatCount + 1)}
                    className="text-foreground p-1.5 rounded-md hover:bg-muted"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">
                  Total Price
                </span>
                <p className="text-3xl font-bold text-foreground">
                  <span className="text-xl text-muted-foreground font-medium align-middle">
                    ₹{" "}
                  </span>
                  {(event.price * seatCount).toFixed(2)}
                </p>
              </div>

              <button
                onClick={handlePayment}
                className="w-full text-center bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity duration-300"
              >
                Book Now
              </button>
            </div>
          </div>
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

      {/* --- SUCCESS MESSAGE POPUP --- */}
      {bookingStatus === "success" && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-2xl shadow-lg text-center max-w-sm mx-auto relative">
            <button
              onClick={() => setBookingStatus(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Booked Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your tickets for "{event.eventName}" have been confirmed.
            </p>
            <button
              onClick={() => {
                setBookingStatus(null);
                navigate("/bookings");
              }}
              className="bg-primary text-primary-foreground font-bold py-2 px-6 rounded-lg w-full"
            >
              View My Bookings
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetailsPage;
