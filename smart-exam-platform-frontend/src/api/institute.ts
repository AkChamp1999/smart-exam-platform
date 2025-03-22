import axios from "axios";

const URL = `${import.meta.env.VITE_API_HOST_URL}/institutes`;

export const fetchInstitutes = async () => {
  try {
    console.log("Fetched URL:", URL);
    const response = await axios.get(URL);
    console.log("Fetched Institutes:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching institutes:", error);
    throw error;
  }
};
