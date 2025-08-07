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

// Status enum
export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

// Department enum (for member assignments)
export enum Department {
  COMPUTER_SCIENCE = "COMPUTER_SCIENCE",
  SOFTWARE_ENGINEERING = "SOFTWARE_ENGINEERING",
  ELECTRICAL_ENGINEERING = "ELECTRICAL_ENGINEERING",
  MECHANICAL_ENGINEERING = "MECHANICAL_ENGINEERING",
  CIVIL_ENGINEERING = "CIVIL_ENGINEERING",
  BUSINESS_ADMINISTRATION = "BUSINESS_ADMINISTRATION",
}

// Batch/Semester enum
export enum Batch {
  SEMESTER_1 = "SEMESTER_1",
  SEMESTER_2 = "SEMESTER_2",
  SEMESTER_3 = "SEMESTER_3",
  SEMESTER_4 = "SEMESTER_4",
  SEMESTER_5 = "SEMESTER_5",
  SEMESTER_6 = "SEMESTER_6",
  SEMESTER_7 = "SEMESTER_7",
  SEMESTER_8 = "SEMESTER_8",
}

// Departments type based on Prisma schema
export interface DepartmentEntity {
  id: number;
  name: string;
  organizationId: number;
  createdAt: Date;
  updatedAt: Date;
  organization: Organization;
  studentsCount?: number;
  batchesCount?: number;
  teachersCount?: number;
  fypGroupsCount?: number;
}

// Batch type based on Prisma schema
export interface BatchEntity {
  id: number;
  name: string;
  batchYear: number;
  batchCode: string;
  departmentId: number;
  createdAt: Date;
  updatedAt: Date;
  department: DepartmentEntity;
  studentsCount?: number;
  gradingSchemesCount?: number;
  fypGroupsCount?: number;
}

// Member type based on API response
export interface Member {
  id: number;
  email: string;
  password?: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: Status;
  roles: Role[];
  department?: Department;
  batch?: Batch;
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

// FYPProjects type based on Prisma schema
export interface FYPProject {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
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
  role: z.nativeEnum(Role, "Please select a valid role"),
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
  role: z.nativeEnum(Role, "Please select a valid role"),
  usageLimit: z
    .number()
    .min(1, "Usage limit must be at least 1")
    .max(10000, "Usage limit cannot exceed 10,000")
    .optional()
    .nullable(),
  expiresAt: z.date().optional().nullable(),
});

// Zod schemas for FYPProject validation
export const createFYPProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Project title is required")
    .min(3, "Project title must be at least 3 characters")
    .max(200, "Project title must be less than 200 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Project description is required")
    .min(10, "Project description must be at least 10 characters")
    .max(1000, "Project description must be less than 1000 characters")
    .trim(),
});

export const editFYPProjectSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, "Project title is required")
    .min(3, "Project title must be at least 3 characters")
    .max(200, "Project title must be less than 200 characters")
    .trim(),
  description: z
    .string()
    .min(1, "Project description is required")
    .min(10, "Project description must be at least 10 characters")
    .max(1000, "Project description must be less than 1000 characters")
    .trim(),
});

// Zod schemas for Member validation
export const createMemberSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
  roles: z.array(z.nativeEnum(Role)).min(1, "At least one role is required"),
  status: z.nativeEnum(Status, "Please select a valid status"),
  department: z.nativeEnum(Department).optional(),
  batch: z.nativeEnum(Batch).optional(),
});

export const editMemberSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  roles: z.array(z.nativeEnum(Role)).min(1, "At least one role is required"),
  status: z.nativeEnum(Status, "Please select a valid status"),
  department: z.nativeEnum(Department).optional(),
  batch: z.nativeEnum(Batch).optional(),
});

export const promoteMemberSchema = z.object({
  memberIds: z.array(z.number()).min(1, "At least one member must be selected"),
  newBatch: z.nativeEnum(Batch, "Please select a valid batch/semester"),
});

// Zod schemas for Department validation
export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required")
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name must be less than 100 characters")
    .trim(),
  organizationId: z.number().min(1, "Organization is required"),
});

export const editDepartmentSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "Department name is required")
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name must be less than 100 characters")
    .trim(),
  organizationId: z.number().min(1, "Organization is required"),
});

// Zod schemas for Batch validation
export const createBatchSchema = z.object({
  name: z
    .string()
    .min(1, "Batch name is required")
    .min(2, "Batch name must be at least 2 characters")
    .max(100, "Batch name must be less than 100 characters")
    .trim(),
  batchYear: z
    .number()
    .min(2020, "Batch year must be 2020 or later")
    .max(2030, "Batch year cannot exceed 2030"),
  batchCode: z
    .string()
    .min(1, "Batch code is required")
    .min(2, "Batch code must be at least 2 characters")
    .max(20, "Batch code must be less than 20 characters")
    .trim()
    .regex(
      /^[A-Z0-9-]+$/,
      "Batch code must contain only uppercase letters, numbers, and hyphens",
    ),
  departmentId: z.number().min(1, "Department is required"),
});

export const editBatchSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "Batch name is required")
    .min(2, "Batch name must be at least 2 characters")
    .max(100, "Batch name must be less than 100 characters")
    .trim(),
  batchYear: z
    .number()
    .min(2020, "Batch year must be 2020 or later")
    .max(2030, "Batch year cannot exceed 2030"),
  batchCode: z
    .string()
    .min(1, "Batch code is required")
    .min(2, "Batch code must be at least 2 characters")
    .max(20, "Batch code must be less than 20 characters")
    .trim()
    .regex(
      /^[A-Z0-9-]+$/,
      "Batch code must contain only uppercase letters, numbers, and hyphens",
    ),
  departmentId: z.number().min(1, "Department is required"),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type EditOrganizationInput = z.infer<typeof editOrganizationSchema>;
export type CreateJoinCodeInput = z.infer<typeof createJoinCodeSchema>;
export type EditJoinCodeInput = z.infer<typeof editJoinCodeSchema>;
export type CreateFYPProjectInput = z.infer<typeof createFYPProjectSchema>;
export type EditFYPProjectInput = z.infer<typeof editFYPProjectSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type EditMemberInput = z.infer<typeof editMemberSchema>;
export type PromoteMemberInput = z.infer<typeof promoteMemberSchema>;
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type EditDepartmentInput = z.infer<typeof editDepartmentSchema>;
export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export type EditBatchInput = z.infer<typeof editBatchSchema>;

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

// Helper function to get status display name
export function getStatusDisplayName(status: Status): string {
  const statusNames = {
    [Status.ACTIVE]: "Active",
    [Status.INACTIVE]: "Inactive",
    [Status.SUSPENDED]: "Suspended",
  };
  return statusNames[status];
}

// Helper function to get status color
export function getStatusColor(status: Status): string {
  const statusColors = {
    [Status.ACTIVE]: "bg-green-100 text-green-800",
    [Status.INACTIVE]: "bg-gray-100 text-gray-800",
    [Status.SUSPENDED]: "bg-red-100 text-red-800",
  };
  return statusColors[status];
}

// Helper function to get department display name
export function getDepartmentDisplayName(department: Department): string {
  const departmentNames = {
    [Department.COMPUTER_SCIENCE]: "Computer Science",
    [Department.SOFTWARE_ENGINEERING]: "Software Engineering",
    [Department.ELECTRICAL_ENGINEERING]: "Electrical Engineering",
    [Department.MECHANICAL_ENGINEERING]: "Mechanical Engineering",
    [Department.CIVIL_ENGINEERING]: "Civil Engineering",
    [Department.BUSINESS_ADMINISTRATION]: "Business Administration",
  };
  return departmentNames[department];
}

// Helper function to get batch display name
export function getBatchDisplayName(batch: Batch): string {
  const batchNames = {
    [Batch.SEMESTER_1]: "Semester 1",
    [Batch.SEMESTER_2]: "Semester 2",
    [Batch.SEMESTER_3]: "Semester 3",
    [Batch.SEMESTER_4]: "Semester 4",
    [Batch.SEMESTER_5]: "Semester 5",
    [Batch.SEMESTER_6]: "Semester 6",
    [Batch.SEMESTER_7]: "Semester 7",
    [Batch.SEMESTER_8]: "Semester 8",
  };
  return batchNames[batch];
}

// Helper function to get next semester
export function getNextSemester(currentBatch: Batch): Batch | null {
  const progression = {
    [Batch.SEMESTER_1]: Batch.SEMESTER_2,
    [Batch.SEMESTER_2]: Batch.SEMESTER_3,
    [Batch.SEMESTER_3]: Batch.SEMESTER_4,
    [Batch.SEMESTER_4]: Batch.SEMESTER_5,
    [Batch.SEMESTER_5]: Batch.SEMESTER_6,
    [Batch.SEMESTER_6]: Batch.SEMESTER_7,
    [Batch.SEMESTER_7]: Batch.SEMESTER_8,
    [Batch.SEMESTER_8]: null, // Graduated
  };
  return progression[currentBatch];
}
