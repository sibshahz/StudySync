import axios from "axios";

export const axios_default = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1",
  withCredentials: true, // Ensures cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

axios_default.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
});

export default axios_default;
