import { z } from "zod";
import { UserRole, SemesterSeason } from "@repo/database/enums";
import { createBatch } from "@/services/batchService";
import { add } from "@/_tests_/math";

// Shared enums
const userRoleEnum = z.nativeEnum(UserRole);
const semesterSeasonEnum = z.nativeEnum(SemesterSeason);

// Now
const validationSchemas = {
  register: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name cannot exceed 50 characters"),

    email: z.string().email("Please provide a valid email address"),

    password: z.string().min(8, "Password must be at least 8 characters long"),

    referralCode: z.string().optional().or(z.literal("")),
  }),

  login: z.object({
    email: z.string().email("Please provide a valid email address"),

    password: z.string().min(1, "Password is required"),
  }),

  refreshToken: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),

  updateProfile: z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
      ),
  }),

  createJoinCode: z.object({
    organizationId: z.number().min(1, "Organization ID is not given"),

    usageLimit: z.number().min(1, "Usage limit must be at least 1").optional(),

    expiresAt: z.coerce
      .date()
      .refine((date) => date > new Date(), {
        message: "Expiration date must be in the future",
      })
      .optional(),

    role: userRoleEnum,
  }),

  updateJoinCode: z.object({
    usageLimit: z.number().min(1, "Usage limit must be at least 1").optional(),

    expiresAt: z.coerce
      .date()
      .refine((date) => date > new Date(), {
        message: "Expiration date must be in the future",
      })
      .optional(),

    id: z.number().min(1, "Id must be atleast present"),
  }),

  createDepartment: z.object({
    name: z
      .string()
      .min(2, "Department name must be at least 2 characters long")
      .max(50, "Department name cannot exceed 50 characters"),
    organizationId: z.number().min(1, "Organization ID is required"),
  }),
  updateDepartment: z.object({
    id: z.number().min(1, "Department ID is required"),
    name: z
      .string()
      .min(2, "Department name must be at least 2 characters long")
      .max(50, "Department name cannot exceed 50 characters"),
  }),
  createBatch: z.object({
    name: z
      .string()
      .min(2, "Batch name must be at least 2 characters long")
      .max(50, "Batch name cannot exceed 50 characters"),
  }),
  updateBatch: z.object({
    name: z
      .string()
      .min(2, "Batch name must be at least 2 characters long")
      .max(50, "Batch name cannot exceed 50 characters"),
  }),
  createSemester: z
    .object({
      name: z
        .string()
        .min(2, "Semester name must be at least 2 characters long")
        .max(100, "Semester name cannot exceed 100 characters"),
      semesterSeason: semesterSeasonEnum,
      startDate: z.coerce.date().refine((date) => date >= new Date(), {
        message: "Start date must be today or in the future",
      }),
      endDate: z.coerce.date(),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "End date must be after start date",
      path: ["endDate"],
    }),
  updateSemester: z
    .object({
      name: z
        .string()
        .min(2, "Semester name must be at least 2 characters long")
        .max(100, "Semester name cannot exceed 100 characters"),
      semesterSeason: semesterSeasonEnum,
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "End date must be after start date",
      path: ["endDate"],
    }),
  createFYPGroupRules: z
    .object({
      minMembers: z
        .number()
        .int()
        .min(1, "Minimum members must be at least 1")
        .max(10, "Minimum members cannot exceed 10")
        .optional(),
      maxMembers: z
        .number()
        .int()
        .min(1, "Maximum members must be at least 1")
        .max(10, "Maximum members cannot exceed 10")
        .optional(),
    })
    .refine(
      (data) => {
        if (data.minMembers && data.maxMembers) {
          return data.minMembers <= data.maxMembers;
        }
        return true;
      },
      {
        message: "Minimum members cannot be greater than maximum members",
        path: ["minMembers"],
      }
    ),
  updateFYPGroupRules: z
    .object({
      minMembers: z
        .number()
        .int()
        .min(1, "Minimum members must be at least 1")
        .max(10, "Minimum members cannot exceed 10")
        .optional(),
      maxMembers: z
        .number()
        .int()
        .min(1, "Maximum members must be at least 1")
        .max(10, "Maximum members cannot exceed 10")
        .optional(),
    })
    .refine(
      (data) => {
        if (data.minMembers && data.maxMembers) {
          return data.minMembers <= data.maxMembers;
        }
        return true;
      },
      {
        message: "Minimum members cannot be greater than maximum members",
        path: ["minMembers"],
      }
    ),
  addDepartmentStudent: z
    .array(
      z.object({
        userId: z.number().int().min(1, "User ID is required"),
      })
    )
    .length(1, "At least one student must be selected"),
};

export { validationSchemas };
