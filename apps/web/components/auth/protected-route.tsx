"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import type { Role } from "@/types/auth"
import { canAccessRoute } from "@/lib/rbac"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: Role[]
  fallback?: React.ReactNode
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  fallback,
  redirectTo = "/signin",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()


  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo,user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  if (requiredRoles.length > 0 && user && !canAccessRoute(user.roles, requiredRoles)) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-semibold mb-2">Access Denied {JSON.stringify(user)}</h2>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
