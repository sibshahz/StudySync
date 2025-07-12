"use client"

import { useAuth } from "@/contexts/auth-context"
import type { Role } from "@/types/auth"
import { canAccessRoute } from "@/lib/rbac"
import type { ComponentType } from "react"

interface WithAuthOptions {
  requiredRoles?: Role[]
  redirectTo?: string
}

export function withAuth<P extends object>(Component: ComponentType<P>, options: WithAuthOptions = {}) {
  const { requiredRoles = [], redirectTo = "/signin" } = options

  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        window.location.href = redirectTo
      }
      return null
    }

    if (requiredRoles.length > 0 && user && !canAccessRoute(user.role, requiredRoles)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}
