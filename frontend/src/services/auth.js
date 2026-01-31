import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1", // change port if needed
  withCredentials: true, // for cookies (JWT)
});

export const registerUser = (data) => API.post("/users/register", data);

export const loginUser = (data) => API.post("/users/login", data);

export const logoutUser = () => API.post("/users/logout");
