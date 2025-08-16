// utils/axios.ts
import axios, { AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1";

// Create instance
export const axios_default = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send cookies along with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
axios_default.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
axios_default.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If unauthorized and we have a refresh token → try refreshing once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry // prevent infinite loop
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        // Call refresh endpoint
        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true },
        );

        const newAccessToken = res.data?.accessToken;
        const newRefreshToken = res.data?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem("token", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }

          // Update header & retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios_default(originalRequest);
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
      }
    }

    return Promise.reject(error);
  },
);
