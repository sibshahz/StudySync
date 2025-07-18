import type { AuthResponse, User } from "@/types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/v1";

// Token management
export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  setToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem("refreshToken", token);
  },

  removeTokens: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },
};

// JWT utilities
export const jwtUtils = {
  isTokenExpired: (token: string): boolean => {
    try {
      const payloadPart = token.split(".")[1];
      if (!payloadPart) throw new Error("Invalid token format");
      const payload = JSON.parse(atob(payloadPart));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },

  getTokenPayload: (token: string): any => {
    try {
      const payloadPart = token.split(".")[1];
      if (!payloadPart) throw new Error("Invalid token format");
      return JSON.parse(atob(payloadPart));
    } catch {
      return null;
    }
  },
};

// API utilities
export const authAPI = {
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data =await response.json();

    return data.data;
  },

  signup: async (credentials: {
    email: string;
    password: string;
    name: string;
    referralCode?: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    const data = await response.json();
    return data.data;
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<{ token: string; refreshToken: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ refreshToken }),

    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    return response.json();
  },

  getProfile: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to get profile");
    }
    const data = await response.json();
    return data.data;
  },

  logout: async (token: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  },
};
