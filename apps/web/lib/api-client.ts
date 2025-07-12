import { tokenStorage, authAPI } from "./auth"

class APIClient {
  private baseURL: string
  private refreshPromise: Promise<void> | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async refreshTokenIfNeeded(): Promise<string | null> {
    const token = tokenStorage.getToken()
    const refreshToken = tokenStorage.getRefreshToken()

    if (!token || !refreshToken) {
      return null
    }

    // Check if token is expired or will expire in the next 5 minutes
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const expiryTime = payload.exp * 1000
      const currentTime = Date.now()
      const fiveMinutes = 5 * 60 * 1000

      if (expiryTime - currentTime < fiveMinutes) {
        // Prevent multiple simultaneous refresh requests
        if (!this.refreshPromise) {
          this.refreshPromise = this.performTokenRefresh(refreshToken)
        }
        await this.refreshPromise
        this.refreshPromise = null
        return tokenStorage.getToken()
      }

      return token
    } catch (error) {
      console.error("Token validation failed:", error)
      return null
    }
  }

  private async performTokenRefresh(refreshToken: string): Promise<void> {
    try {
      const response = await authAPI.refreshToken(refreshToken)
      tokenStorage.setToken(response.token)
      tokenStorage.setRefreshToken(response.refreshToken)
    } catch (error) {
      tokenStorage.removeTokens()
      window.location.href = "/signin"
      throw error
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.refreshTokenIfNeeded()

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, config)

    if (response.status === 401) {
      tokenStorage.removeTokens()
      window.location.href = "/signin"
      throw new Error("Unauthorized")
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }))
      throw new Error(error.message || "Request failed")
    }

    return response.json()
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api")
