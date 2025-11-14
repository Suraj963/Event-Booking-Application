import axios from "axios";
import { API_URI } from "../../../common/Components";
import { getHeaders } from "../../../store";

const formatTimeForBackend = (timeString) => {
  if (!timeString) return "00-00-00";
  const [hours, minutes] = timeString.split(":");
  const formattedHours = hours.padStart(2, "0");
  const formattedMinutes = minutes.padStart(2, "0");

  return `${formattedHours}-${formattedMinutes}-00`;
};

const createFormData = (eventData) => {
  const formData = new FormData();
  formData.append("eventName", eventData.eventName || "");
  formData.append("eventType", eventData.eventType || "");
  formData.append("description", eventData.description || "");
  formData.append("eventDate", eventData.eventDate || "");
  formData.append("eventTime", formatTimeForBackend(eventData.eventTime));
  formData.append("location", eventData.location || "");
  formData.append("totalSeats", eventData.totalSeats || "");
  formData.append("availableSeats", eventData.availableSeats || "");
  formData.append("price", eventData.price || "");

  if (eventData.image) {
    formData.append("image", eventData.image);
  }

  return formData;
};

const addEvent = async (eventData) => {
  const formData = createFormData(eventData);
  try {
    const response = await axios.post(`${API_URI}/event/add`, formData);
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

const updateEvent = async (eventData) => {
  const formData = createFormData(eventData);
  try {
    const response = await axios.put(
      `${API_URI}/event/update/${eventData.id}`,
      formData
    );
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

const fetchEventById = async (id) => {
  try {
    const response = await axios.get(`${API_URI}/event/getById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

const eventBooking = async (bookingData) => {
  const headers = await getHeaders();
  try {
    const response = await axios.post(
      `${API_URI}/bookings/bookEvent`,
      bookingData,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`${API_URI}/event/delete/${id}`);
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

export { addEvent, updateEvent, fetchEventById, eventBooking, deleteEvent };
