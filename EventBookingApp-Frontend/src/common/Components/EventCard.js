import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { API_URI } from ".";
import { FormatDate, convertTo12Hour } from "../../utils/FormatDateAndTime.js";

const EventCard = ({ event, onDeleteClick, deleteStatus, role }) => {
  const {
    id,
    image,
    eventType,
    eventName,
    eventDate,
    eventTime,
    location,
    availableSeats,
    description,
    price,
  } = event;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/event/${id}`);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (deleteStatus) {
      onDeleteClick(event);
    }
  };

  return (
    <div
      className="bg-card rounded-2xl overflow-hidden border border-border/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out transform hover:-translate-y-2 group text-left flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={`${image}`}
          alt={eventName}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/100f1a/FFFFFF?text=Eventify";
          }}
        />
        <span className="absolute top-4 right-4 bg-primary/80 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
          {eventType}
        </span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="text-xl font-bold text-foreground">{eventName}</h3>
          {role === "ADMIN" && (
            <div className="flex space-x-3 flex-shrink-0">
              <Link
                to={`/add-event/${id}`}
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Edit Event"
              >
                <PencilSquareIcon className="h-5 w-5" />
              </Link>
              {deleteStatus && (
                <button
                  onClick={handleDeleteClick}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete Event"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 text-muted-foreground mb-4 text-sm">
          <p className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2.5 text-primary" />{" "}
            {FormatDate(eventDate)} at {convertTo12Hour(eventTime)}
          </p>
          <p className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2.5 text-primary" /> {location}
          </p>
          <p className="flex items-center text-yellow-400 font-semibold">
            <TicketIcon className="h-4 w-4 mr-2.5 text-yellow-400" />{" "}
            {availableSeats} seats available
          </p>
        </div>
        <p className="text-muted-foreground text-sm mb-6 flex-grow">
          {truncateText(description, 90)}
        </p>
        <div className="flex flex-row justify-between items-center mt-auto pt-4 border-t border-border/20">
          <p className="text-2xl font-bold text-foreground">
            <span className="text-lg text-muted-foreground font-medium align-middle">
              ₹{" "}
            </span>
            {price.toFixed(2)}
          </p>
          <div className="text-center bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity duration-300">
            View Details
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
