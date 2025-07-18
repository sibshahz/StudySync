import type { Role } from "@/types/auth";
import { UserRole } from "@repo/database/enums";

export const ROLES = UserRole;

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
} as const;

type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: [
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
  TEACHER: [
    PERMISSIONS.MODERATE_CONTENT,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_OWN_CONTENT,
    PERMISSIONS.VIEW_CONTENT,
  ],
  STUDENT: [
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_OWN_CONTENT,
    PERMISSIONS.VIEW_CONTENT,
  ],
  STAFF: [],
  USER: [],
};

// ✅ Updated to support multiple user roles
export function hasPermission(userRoles: Role[], permission: Permission): boolean {
  return userRoles.some((role) => rolePermissions[role]?.includes(permission));
}

export function hasAnyPermission(userRoles: Role[], permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(userRoles, permission));
}

export function hasAllPermissions(userRoles: Role[], permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(userRoles, permission));
}

export function canAccessRoute(userRoles: Role[], requiredRoles: Role[]): boolean {
  return userRoles.some((role) => requiredRoles.includes(role));
}
