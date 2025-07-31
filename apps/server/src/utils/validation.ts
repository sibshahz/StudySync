import { z } from "zod";
import { UserRole } from "@repo/database/enums";

// Shared enums
const userRoleEnum = z.nativeEnum(UserRole);

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
};

export { validationSchemas };
