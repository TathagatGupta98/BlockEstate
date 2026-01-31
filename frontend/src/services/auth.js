import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  }
});
//"http://localhost:8000/api/v1/users/register"

export const registerUser = async (data) => {
  console.log("Auth service - Sending registration data:", data);
  
  try {
    const response = await API.post("/users/register", data);
    console.log("Auth service - Registration response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Auth service - Registration error:", error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (data) => {
  console.log("Auth service - Sending login data:", data);
  
  try {
    const response = await API.post("/users/login", data);
    console.log("Auth service - Login response:", response.data);
    
    // Store token in localStorage for Authorization header
    if (response.data?.data?.accessToken) {
      localStorage.setItem("token", response.data.data.accessToken);
      console.log("Auth service - Token stored in localStorage");
    }
    
    return response.data;
  } catch (error) {
    console.error("Auth service - Login error:", error.response?.data || error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await API.post("/users/logout");
    
    // Clear token from localStorage
    localStorage.removeItem("token");
    console.log("Auth service - Logged out, token removed");
    
    return response.data;
  } catch (error) {
    console.error("Auth service - Logout error:", error.response?.data || error.message);
    throw error;
  }
};

// Add request interceptor to include token in headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Request:", config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error logging
API.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Response error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default API;