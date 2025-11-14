import axios from "axios";
import { API_URI } from "../../../common/Components";

const signUp = async (data) => {
  try {
    const response = await axios.post(`${API_URI}/api/auth/user/signUp`, data);
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

const signIn = async (data) => {
  try {
    const response = await axios.post(`${API_URI}/api/auth/user/signIn`, null, {
      params: data,
    });
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

export { signUp, signIn };
