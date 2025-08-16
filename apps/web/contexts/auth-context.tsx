"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  AuthState,
  User,
  LoginCredentials,
  SignUpCredentials,
} from "@/types/auth";
import { tokenStorage, jwtUtils, authAPI } from "@/lib/auth";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "SET_USER";
      payload: { user: User; token: string; refreshToken: string };
    }
  | { type: "CLEAR_USER" }
  | { type: "UPDATE_TOKEN"; payload: { token: string; refreshToken: string } };

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "UPDATE_TOKEN":
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Refresh auth function
  const refreshAuth = useCallback(async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await authAPI.refreshToken(refreshToken);

      tokenStorage.setToken(response.token);
      tokenStorage.setRefreshToken(response.refreshToken);

      dispatch({
        type: "UPDATE_TOKEN",
        payload: {
          token: response.token,
          refreshToken: response.refreshToken,
        },
      });

      return response.token;
    } catch (error) {
      console.error("[AUTH CONTEXT] Token refresh failed:", error);
      tokenStorage.removeTokens();
      dispatch({ type: "CLEAR_USER" });
      throw error;
    }
  }, []);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const token = tokenStorage.getToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (!token || !refreshToken) {
        console.log("[AUTH CONTEXT] No tokens found, user not authenticated");
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      // Check if token is expired
      if (jwtUtils.isTokenExpired(token)) {
        console.log("[AUTH CONTEXT] Token expired, attempting refresh...");
        try {
          await refreshAuth();
          // After successful refresh, get user profile with new token
          const newToken = tokenStorage.getToken();
          if (newToken) {
            const user = await authAPI.getProfile(newToken);
            dispatch({
              type: "SET_USER",
              payload: {
                user,
                token: newToken,
                refreshToken: tokenStorage.getRefreshToken() || refreshToken,
              },
            });
          }
        } catch (refreshError) {
          console.error(
            "[AUTH CONTEXT] Failed to refresh during initialization:",
            refreshError,
          );
          dispatch({ type: "CLEAR_USER" });
        }
      } else {
        // Token is valid, get user profile
        try {
          const user = await authAPI.getProfile(token);
          dispatch({
            type: "SET_USER",
            payload: { user, token, refreshToken },
          });
        } catch (profileError) {
          console.error("[AUTH CONTEXT] Failed to get profile:", profileError);
          // Token might be invalid, try refresh
          try {
            await refreshAuth();
            const newToken = tokenStorage.getToken();
            if (newToken) {
              const user = await authAPI.getProfile(newToken);
              dispatch({
                type: "SET_USER",
                payload: {
                  user,
                  token: newToken,
                  refreshToken: tokenStorage.getRefreshToken() || refreshToken,
                },
              });
            }
          } catch (fallbackError) {
            console.error(
              "[AUTH CONTEXT] All auth attempts failed:",
              fallbackError,
            );
            tokenStorage.removeTokens();
            dispatch({ type: "CLEAR_USER" });
          }
        }
      }
    } catch (error) {
      console.error("[AUTH CONTEXT] Auth initialization failed:", error);
      tokenStorage.removeTokens();
      dispatch({ type: "CLEAR_USER" });
    }
  }, [refreshAuth]);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // REMOVED: Auto token refresh timer to prevent conflicts with API client
  // The API client now handles token refresh automatically

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await authAPI.login(credentials);

      // Store tokens
      tokenStorage.setToken(response.token);
      tokenStorage.setRefreshToken(response.refreshToken);

      // Update auth state
      dispatch({
        type: "SET_USER",
        payload: {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        },
      });

      console.log("[AUTH CONTEXT] ✅ Login successful");
    } catch (error) {
      console.error("[AUTH CONTEXT] ❌ Login failed:", error);
      tokenStorage.removeTokens();
      dispatch({ type: "CLEAR_USER" });
      throw error;
    }
  };

  const signup = async (credentials: SignUpCredentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await authAPI.signup(credentials);

      // Store tokens
      tokenStorage.setToken(response.token);
      tokenStorage.setRefreshToken(response.refreshToken);

      // Update auth state
      dispatch({
        type: "SET_USER",
        payload: {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        },
      });

      console.log("[AUTH CONTEXT] ✅ Signup successful");
    } catch (error) {
      console.error("[AUTH CONTEXT] ❌ Signup failed:", error);
      tokenStorage.removeTokens();
      dispatch({ type: "CLEAR_USER" });
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (state.token) {
        await authAPI.logout(state.token);
      }
      console.log("[AUTH CONTEXT] ✅ Logout successful");
    } catch (error) {
      console.error("[AUTH CONTEXT] ❌ Logout error:", error);
      // Continue with logout even if API call fails
    } finally {
      tokenStorage.removeTokens();
      dispatch({ type: "CLEAR_USER" });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
