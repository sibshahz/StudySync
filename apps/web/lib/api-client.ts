import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { tokenStorage, authAPI } from "./auth";

class APIClient {
  private axiosInstance: AxiosInstance;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.refreshTokenIfNeeded();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle 401 errors
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          tokenStorage.removeTokens();
          if (typeof window !== "undefined") {
            window.location.href = "/signin";
          }
        }
        return Promise.reject(error);
      },
    );
  }

  private async refreshTokenIfNeeded(): Promise<string | null> {
    const token = tokenStorage.getToken();
    const refreshToken = tokenStorage.getRefreshToken();

    if (!token || !refreshToken) {
      return null;
    }

    // Check if token is expired or will expire in the next 5 minutes
    try {
      const tokenPayload = token.split(".")[1];
      if (!tokenPayload) {
        throw new Error("Invalid token format");
      }
      const payload = JSON.parse(atob(tokenPayload));
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (expiryTime - currentTime < fiveMinutes) {
        // Prevent multiple simultaneous refresh requests
        if (!this.refreshPromise) {
          this.refreshPromise = this.performTokenRefresh(refreshToken);
        }
        await this.refreshPromise;
        this.refreshPromise = null;
        return tokenStorage.getToken();
      }

      return token;
    } catch (error) {
      console.error("Token validation failed:", error);
      return null;
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<void> {
    try {
      const response = await authAPI.refreshToken(refreshToken);
      tokenStorage.setToken(response.token);
      tokenStorage.setRefreshToken(response.refreshToken);
    } catch (error) {
      tokenStorage.removeTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
      throw error;
    }
  }

  async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {},
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        url: endpoint,
        ...config,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message || error.message || "Request failed";
        throw new Error(message);
      }
      throw error;
    }
  }

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

  // Additional utility methods for common use cases
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

  // Method to set custom headers for specific requests
  setDefaultHeader(key: string, value: string): void {
    this.axiosInstance.defaults.headers.common[key] = value;
  }

  // Method to remove custom headers
  removeDefaultHeader(key: string): void {
    delete this.axiosInstance.defaults.headers.common[key];
  }
}

export const apiClient = new APIClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
);
