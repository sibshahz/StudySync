import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { tokenStorage } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1";

// Global flag to prevent multiple simultaneous redirects
let isRedirecting = false;

// Global promise to prevent multiple simultaneous refresh attempts
let refreshPromise: Promise<string | null> | null = null;

class UnifiedAPIClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - add token to headers
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = tokenStorage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor - handle 401 errors with token refresh
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();

            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }

        // Handle other 401s or failed refresh
        if (error.response?.status === 401) {
          this.handleAuthFailure();
        }

        return Promise.reject(error);
      },
    );
  }

  private async refreshToken(): Promise<string | null> {
    // Prevent multiple simultaneous refresh attempts
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = this.performTokenRefresh();

    try {
      const result = await refreshPromise;
      return result;
    } finally {
      refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string | null> {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      // Use a fresh axios instance to avoid interceptor loops
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      const data = response.data;
      const newToken = data.token || data.data?.token;
      const newRefreshToken = data.refreshToken || data.data?.refreshToken;

      if (!newToken || !newRefreshToken) {
        throw new Error("Invalid refresh response format");
      }

      // Update stored tokens
      tokenStorage.setToken(newToken);
      tokenStorage.setRefreshToken(newRefreshToken);

      console.log("[API CLIENT] ✅ Token refreshed successfully");
      return newToken;
    } catch (error) {
      console.error("[API CLIENT] ❌ Token refresh failed:", error);
      throw error;
    }
  }

  private handleAuthFailure(): void {
    // Prevent multiple simultaneous redirects
    if (isRedirecting) {
      return;
    }

    isRedirecting = true;

    // Clear tokens
    tokenStorage.removeTokens();

    // Only redirect if we're in a browser environment
    if (typeof window !== "undefined") {
      console.log(
        "[API CLIENT] ❌ Authentication failed, redirecting to signin",
      );

      // Small delay to prevent immediate redirect conflicts
      setTimeout(() => {
        window.location.href = "/signin?reason=session_expired";
        isRedirecting = false;
      }, 100);
    }
  }

  // Core request method
  async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        url: endpoint,
        ...config,
      });

      // Handle both direct data and nested data responses
      const responseData =
        (response as any).data?.data || (response as any).data || response.data;
      return responseData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Request failed";

        console.error(`[API CLIENT] Request failed: ${endpoint}`, {
          status: error.response?.status,
          message,
          data: error.response?.data,
        });

        throw new Error(message);
      }
      throw error;
    }
  }

  // HTTP method shortcuts
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      data,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      data,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      data,
    });
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }

  // File upload method
  async uploadFile<T>(
    endpoint: string,
    file: File,
    onUploadProgress?: (progress: number) => void,
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<T>(endpoint, {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          onUploadProgress(progress);
        }
      },
    });
  }

  // Header management
  setDefaultHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  removeDefaultHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }

  // Get current instance for advanced use cases
  getInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export singleton instance
export const apiClient = new UnifiedAPIClient(API_BASE_URL);

// Also export the axios instance for backward compatibility
export const axios_default = apiClient.getInstance();
