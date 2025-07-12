export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" | "moderator";
  avatar?: string;
  organizations?: {
    id: string;
    name: string;
    role: "admin" | "member";
  }[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  referralCode?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export type Role = "admin" | "user" | "moderator";
