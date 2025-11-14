import axios from "axios";
import { API_URI } from "../../../common/Components";

const fetchEvents = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_URI}/event/getAll`, {
      params: { search: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

const getStatistics = async () => {
  try {
    const response = await axios.get(`${API_URI}/event/getStatistics`);
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

export { fetchEvents, getStatistics };
