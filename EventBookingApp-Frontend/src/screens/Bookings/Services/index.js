import axios from "axios";
import { API_URI } from "../../../common/Components";
import { getHeaders } from "../../../store";

const fetchUserBookings = async (data) => {
  const headers = await getHeaders();
  try {
    const response = await axios.get(`${API_URI}/bookings/getUserBookings`, {
      params: data,
      headers,
    });
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

const cancelBooking = async (bookingId) => {
  try {
    const response = await axios.put(
      `${API_URI}/bookings/cancelBooking/${bookingId}`
    );
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

const fetchAllUsers = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_URI}/api/auth/user/getAllUsers`, {
      params: { search: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

export { fetchUserBookings, cancelBooking, fetchAllUsers };
