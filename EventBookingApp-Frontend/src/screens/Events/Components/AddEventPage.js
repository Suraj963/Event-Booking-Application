import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { validateEventFormFields } from "../Validation";
import { addEvent, fetchEventById, updateEvent } from "../Services";
import Toast from "../../../common/Components/Toast";
import {
  EventTypeSelector,
  ImageUploadField,
  InputField,
  TextAreaField,
} from "./FormInputFelds";

const AddEventPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [eventData, setEventData] = useState({
    eventName: "",
    eventType: "",
    description: "",
    eventDate: "",
    eventTime: "",
    location: "",
    totalSeats: "",
    availableSeats: "",
    price: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [snackbar, setSnackbar] = useState({
    show: false,
    message: "",
    type: "",
  });

  const formatDateForInput = (timestamp) => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Invalid timestamp for date:", timestamp);
      return "";
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let updatedValue = value;
    if (name === "image") {
      updatedValue = files[0] || null;
    }
    setEventData((prev) => ({ ...prev, [name]: updatedValue }));

    setErrors((prevErrors) => {
      const fieldErrors = validateEventFormFields({
        ...eventData,
        [name]: updatedValue,
      });
      if (submitted) {
        return fieldErrors;
      } else {
        return { ...prevErrors, [name]: fieldErrors[name] };
      }
    });
  };

  const handleTypeChange = (type) => {
    setEventData((prev) => ({ ...prev, eventType: type }));
    setTouched((prev) => ({ ...prev, eventType: true }));
    const fieldErrors = validateEventFormFields({
      ...eventData,
      eventType: type,
    });
    setErrors((prevErrors) => {
      if (submitted) return fieldErrors;
      else return { ...prevErrors, eventType: fieldErrors.eventType };
    });
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validateEventFormFields(eventData);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: fieldErrors[name] }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ show: false, message: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const handleAdd = async () => {
    const validationErrors = validateEventFormFields(eventData);
    setErrors(validationErrors);

    setSubmitted(true);
    setTouched({
      eventName: true,
      eventType: true,
      description: true,
      eventDate: true,
      eventTime: true,
      location: true,
      totalSeats: true,
      availableSeats: true,
      price: true,
      image: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await addEvent(eventData);
        if (response.statusCode === 200) {
          setSnackbar({
            show: true,
            message: `Event ${id ? "updated" : "created"} successfully!`,
            type: "success",
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {
        console.error("Failed to save event:", error);
        setSnackbar({
          show: true,
          message: `Failed to ${
            id ? "update" : "create"
          } event. Please try again.`,
          type: "error",
        });
      }
    }
  };

  const handleUpdate = async () => {
    const validationErrors = validateEventFormFields(eventData);
    setErrors(validationErrors);

    setSubmitted(true);
    setTouched({
      eventName: true,
      eventType: true,
      description: true,
      eventDate: true,
      eventTime: true,
      location: true,
      totalSeats: true,
      availableSeats: true,
      price: true,
      image: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await updateEvent(eventData);
        if (response.statusCode === 200) {
          setSnackbar({
            show: true,
            message: `Event ${id ? "updated" : "created"} successfully!`,
            type: "success",
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      } catch (error) {
        console.error("Failed to save event:", error);
        setSnackbar({
          show: true,
          message: `Failed to ${
            id ? "update" : "create"
          } event. Please try again.`,
          type: "error",
        });
      }
    }
  };

  const getEventById = async () => {
    try {
      const response = await fetchEventById(id);
      if (response.statusCode === 200) {
        const fetchedData = response.data;
        const formattedData = {
          ...fetchedData,
          eventDate: formatDateForInput(fetchedData.eventDate),
        };
        setEventData(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
      setSnackbar({
        show: true,
        message: "Could not load event data.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (id) {
      getEventById();
    }
  }, [id]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          {id ? "Edit Event" : "Create New Event"}
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          {id
            ? "Update the details for your event below."
            : "Fill in the details below to add a new event to the platform."}
        </p>
      </header>

      <div className="max-w-4xl mx-auto bg-card/50 p-8 rounded-2xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="eventName"
              label="Event Name"
              type="text"
              placeholder="e.g., Summer Music Festival"
              value={eventData.eventName}
              onChange={handleChange}
              error={touched.eventName ? errors.eventName : ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <InputField
              id="location"
              label="Location"
              type="text"
              placeholder="e.g., Central Park, New York"
              value={eventData.location}
              onChange={handleChange}
              error={touched.location ? errors.location : ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <EventTypeSelector
            selectedType={eventData.eventType}
            onTypeChange={handleTypeChange}
            error={touched.eventType ? errors.eventType : ""}
          />

          <TextAreaField
            id="description"
            label="Description"
            placeholder="Describe the event..."
            value={eventData.description}
            onChange={handleChange}
            error={touched.description ? errors.description : ""}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="eventDate"
              label="Event Date"
              type="date"
              value={eventData.eventDate}
              onChange={handleChange}
              error={touched.eventDate ? errors.eventDate : ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <InputField
              id="eventTime"
              label="Event Time"
              type="time"
              value={eventData.eventTime}
              onChange={handleChange}
              error={touched.eventTime ? errors.eventTime : ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              id="totalSeats"
              label="Total Seats"
              type="number"
              placeholder="e.g., 500"
              value={eventData.totalSeats}
              onChange={handleChange}
              error={touched.totalSeats ? errors.totalSeats : ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <InputField
              id="availableSeats"
              label="Available Seats"
              type="number"
              placeholder="e.g., 500"
              value={eventData.availableSeats}
              onChange={handleChange}
              error={touched.availableSeats ? errors.availableSeats : ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <InputField
              id="price"
              label="Price (₹)"
              type="number"
              placeholder="e.g., 89.99"
              value={eventData.price}
              onChange={handleChange}
              error={touched.price ? errors.price : ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <ImageUploadField
            id="image"
            label="Event Image"
            imageData={eventData.image}
            onChange={handleChange}
            error={touched.image ? errors.image : ""}
          />

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {id ? "Update Event" : "Add Event"}
            </button>
          </div>
        </form>
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

export default AddEventPage;
