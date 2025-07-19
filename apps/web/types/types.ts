import { z } from "zod";

// Organization type based on Prisma schema
export interface Organization {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Role enum
export enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STAFF = "STAFF",
  STUDENT = "STUDENT",
  USER = "USER",
}

// JoinCode type based on Prisma schema
export interface JoinCode {
  id: number;
  code: string;
  organizationId: number;
  role: Role;
  usageLimit: number | null;
  usedCount: number;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  organization: Organization;
}

// Zod schemas for Organization validation
export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must be less than 100 characters")
    .trim(),
});

export const editOrganizationSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "Organization name is required")
    .min(2, "Organization name must be at least 2 characters")
    .max(100, "Organization name must be less than 100 characters")
    .trim(),
});

// Zod schemas for JoinCode validation
export const createJoinCodeSchema = z.object({
  organizationId: z.number().min(1, "Organization is required"),
  role: z.nativeEnum(Role).refine((val) => Object.values(Role).includes(val), {
    message: "Please select a valid role",
  }),
  usageLimit: z
    .number()
    .min(1, "Usage limit must be at least 1")
    .max(10000, "Usage limit cannot exceed 10,000")
    .optional()
    .nullable(),
  expiresAt: z.date().optional().nullable(),
});

export const editJoinCodeSchema = z.object({
  id: z.number(),
  organizationId: z.number().min(1, "Organization is required"),
  role: z.nativeEnum(Role).refine((val) => Object.values(Role).includes(val), {
    message: "Please select a valid role",
  }),
  usageLimit: z
    .number()
    .min(1, "Usage limit must be at least 1")
    .max(10000, "Usage limit cannot exceed 10,000")
    .optional()
    .nullable(),
  expiresAt: z.date().optional().nullable(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type EditOrganizationInput = z.infer<typeof editOrganizationSchema>;
export type CreateJoinCodeInput = z.infer<typeof createJoinCodeSchema>;
export type EditJoinCodeInput = z.infer<typeof editJoinCodeSchema>;

// Helper function to generate unique join codes
export function generateJoinCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper function to get role display name
export function getRoleDisplayName(role: Role): string {
  const roleNames = {
    [Role.ADMIN]: "Administrator",
    [Role.TEACHER]: "Teacher",
    [Role.STAFF]: "Staff",
    [Role.STUDENT]: "Student",
    [Role.USER]: "User",
  };
  return roleNames[role];
}

// Helper function to get role color
export function getRoleColor(role: Role): string {
  const roleColors = {
    [Role.ADMIN]: "bg-red-100 text-red-800",
    [Role.TEACHER]: "bg-blue-100 text-blue-800",
    [Role.STAFF]: "bg-green-100 text-green-800",
    [Role.STUDENT]: "bg-purple-100 text-purple-800",
    [Role.USER]: "bg-gray-100 text-gray-800",
  };
  return roleColors[role];
}
