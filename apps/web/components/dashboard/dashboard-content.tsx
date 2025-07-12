"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { hasPermission, PERMISSIONS } from "@/lib/rbac"

export default function DashboardContent() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.name}!</CardTitle>
              <CardDescription>Role: {user?.role}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>You are successfully authenticated.</p>
            </CardContent>
          </Card>

          {user && hasPermission(user.role, PERMISSIONS.MANAGE_USERS) && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Admin only feature</CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Manage Users</Button>
              </CardContent>
            </Card>
          )}

          {user && hasPermission(user.role, PERMISSIONS.MODERATE_CONTENT) && (
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Moderator feature</CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Moderate Content</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
