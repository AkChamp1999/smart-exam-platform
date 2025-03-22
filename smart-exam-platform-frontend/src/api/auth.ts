import axios from "axios";

const API_AUTH_URL = `${import.meta.env.VITE_API_HOST_URL}/auth`;

export const registerStudent = async (userData: {
  name: string;
  email: string;
  password: string;
  studentClass: string;
  rollNo: string;
  instituteName: string;
}) => {
  try {
    const response = await axios.post(
      `${API_AUTH_URL}/register-student`,
      userData
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Student registration failed";
  }
};

export const registerTeacher = async (userData: {
  name: string;
  email: string;
  password: string;
  instituteName: string;
}) => {
  try {
    const response = await axios.post(
      `${API_AUTH_URL}/register-teacher`,
      userData
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Teacher registration failed";
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_AUTH_URL}/login`, credentials);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Login failed";
  }
};
