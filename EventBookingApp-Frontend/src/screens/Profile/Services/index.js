import axios from "axios";
import { API_URI } from "../../../common/Components";
import { getHeaders } from "../../../store";

const fetchUser = async () => {
  const headers = await getHeaders();
  try {
    const response = await axios.get(`${API_URI}/api/auth/user/getUser`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.log("Full Error:", error);
    console.log("Response Error:", error.response?.data);
    throw error;
  }
};

const updateNewPassword = async (passwords) => {
  const headers = await getHeaders();
  try {
    const response = await axios.put(
      `${API_URI}/api/auth/user/updateUserPassword`,
      null,
      {
        params: passwords,
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

export { fetchUser, updateNewPassword };
