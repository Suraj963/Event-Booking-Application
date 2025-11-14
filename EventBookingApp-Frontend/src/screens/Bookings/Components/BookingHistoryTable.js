import {
  CalendarDaysIcon,
  CurrencyDollarIcon,
  UsersIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const BookingHistoryTable = ({ bookings, onDownloadTicket, onCancel }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/10 text-green-400";
      case "Cancelled":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card/50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Booking History
      </h2>
      {bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-full text-sm">
            <div className="hidden md:grid md:grid-cols-12 gap-4 font-semibold text-muted-foreground p-4 border-b border-border">
              <div className="col-span-3">Event</div>
              <div className="col-span-3">Date & Time</div>
              <div className="col-span-1">Seats</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-3 text-center">Actions</div>
            </div>
            <div>
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="md:col-span-3">
                    <p className="font-bold text-foreground">{booking.event}</p>
                    <p className="text-xs text-muted-foreground">
                      Booked on {booking.bookedOn}
                    </p>
                  </div>
                  <div className="md:col-span-3 flex items-center text-muted-foreground">
                    <CalendarDaysIcon className="h-4 w-4 mr-2 md:hidden text-primary" />
                    <span className="md:hidden font-semibold mr-2 text-foreground">
                      Date:
                    </span>
                    {booking.date}
                  </div>
                  <div className="md:col-span-1 flex items-center text-muted-foreground">
                    <UsersIcon className="h-4 w-4 mr-2 md:hidden text-primary" />
                    <span className="md:hidden font-semibold mr-2 text-foreground">
                      Seats:
                    </span>
                    {booking.seats}
                  </div>
                  <div className="md:col-span-1 flex items-center text-muted-foreground">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2 md:hidden text-primary" />
                    <span className="md:hidden font-semibold mr-2 text-foreground">
                      Amount:
                    </span>
                    ₹{booking.amount.toFixed(2)}
                  </div>
                  <div className="md:col-span-1">
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusClasses(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="md:col-span-3 flex items-center space-x-2">
                    <button
                      onClick={() => onDownloadTicket(booking)}
                      className="flex items-center space-x-1.5 bg-muted/50 hover:bg-muted px-3 py-1.5 rounded-md font-semibold text-foreground transition-colors flex-shrink-0"
                    >
                      <TicketIcon className="h-4 w-4" />
                      <span>Download Ticket</span>
                    </button>
                    {booking.status !== "Cancelled" && (
                      <button
                        type="button"
                        onClick={() => onCancel(booking)}
                        className="bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-md font-semibold text-red-400 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <TicketIcon className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <h3 className="mt-4 text-xl font-semibold text-foreground">
            No Bookings Yet
          </h3>
          <p className="mt-1 text-muted-foreground">
            You haven't booked any events. Let's find something exciting!
          </p>
          <Link
            to="/events"
            className="mt-6 inline-block bg-primary text-primary-foreground font-bold py-2 px-6 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookingHistoryTable;
