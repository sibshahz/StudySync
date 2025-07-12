"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import type { AuthState, User, LoginCredentials, SignUpCredentials } from "@/types/auth"
import { tokenStorage, jwtUtils, authAPI } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignUpCredentials) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: { user: User; token: string; refreshToken: string } }
  | { type: "CLEAR_USER" }
  | { type: "UPDATE_TOKEN"; payload: { token: string; refreshToken: string } }

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,
  isAuthenticated: false,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      }
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case "UPDATE_TOKEN":
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  // Auto refresh token
  useEffect(() => {
    if (state.token && !jwtUtils.isTokenExpired(state.token)) {
      const payload = jwtUtils.getTokenPayload(state.token)
      const timeUntilExpiry = payload.exp * 1000 - Date.now()
      const refreshTime = Math.max(timeUntilExpiry - 60000, 30000) // Refresh 1 minute before expiry, minimum 30 seconds

      const timer = setTimeout(() => {
        refreshAuth()
      }, refreshTime)

      return () => clearTimeout(timer)
    }
  }, [state.token])

  const initializeAuth = async () => {
    try {
      const token = tokenStorage.getToken()
      const refreshToken = tokenStorage.getRefreshToken()

      if (!token || !refreshToken) {
        dispatch({ type: "SET_LOADING", payload: false })
        return
      }

      if (jwtUtils.isTokenExpired(token)) {
        await refreshAuth()
      } else {
        const user = await authAPI.getProfile(token)
        dispatch({ type: "SET_USER", payload: { user, token, refreshToken } })
      }
    } catch (error) {
      console.error("Auth initialization failed:", error)
      tokenStorage.removeTokens()
      dispatch({ type: "CLEAR_USER" })
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await authAPI.login(credentials)

      tokenStorage.setToken(response.token)
      tokenStorage.setRefreshToken(response.refreshToken)

      dispatch({
        type: "SET_USER",
        payload: {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        },
      })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const signup = async (credentials: SignUpCredentials) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await authAPI.signup(credentials)

      tokenStorage.setToken(response.token)
      tokenStorage.setRefreshToken(response.refreshToken)

      dispatch({
        type: "SET_USER",
        payload: {
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
        },
      })
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw error
    }
  }

  const logout = async () => {
    try {
      if (state.token) {
        await authAPI.logout(state.token)
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      tokenStorage.removeTokens()
      dispatch({ type: "CLEAR_USER" })
    }
  }

  const refreshAuth = async () => {
    try {
      const refreshToken = tokenStorage.getRefreshToken()
      if (!refreshToken) {
        throw new Error("No refresh token available")
      }

      const response = await authAPI.refreshToken(refreshToken)

      tokenStorage.setToken(response.token)
      tokenStorage.setRefreshToken(response.refreshToken)

      dispatch({
        type: "UPDATE_TOKEN",
        payload: {
          token: response.token,
          refreshToken: response.refreshToken,
        },
      })
    } catch (error) {
      console.error("Token refresh failed:", error)
      tokenStorage.removeTokens()
      dispatch({ type: "CLEAR_USER" })
      throw error
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
