import type { Role } from "@/types/auth"

export const ROLES = {
  ADMIN: "admin" as const,
  MODERATOR: "moderator" as const,
  USER: "user" as const,
}

export const PERMISSIONS = {
  // Admin permissions
  MANAGE_USERS: "manage_users",
  MANAGE_ROLES: "manage_roles",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_CONTENT: "manage_content",

  // Moderator permissions
  MODERATE_CONTENT: "moderate_content",
  VIEW_REPORTS: "view_reports",

  // User permissions
  CREATE_CONTENT: "create_content",
  EDIT_OWN_CONTENT: "edit_own_content",
  VIEW_CONTENT: "view_content",
} as const

type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_OWN_CONTENT,
    PERMISSIONS.VIEW_CONTENT,
  ],
  moderator: [
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_OWN_CONTENT,
    PERMISSIONS.VIEW_CONTENT,
  ],
  user: [PERMISSIONS.CREATE_CONTENT, PERMISSIONS.EDIT_OWN_CONTENT, PERMISSIONS.VIEW_CONTENT],
}

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return rolePermissions[userRole]?.includes(permission) || false
}

export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(userRole, permission))
}

export function canAccessRoute(userRole: Role, requiredRoles: Role[]): boolean {
  return requiredRoles.includes(userRole)
}
