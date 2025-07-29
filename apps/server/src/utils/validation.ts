import Joi from "joi";
import { UserRole } from "@repo/database/enums";

const validationSchemas = {
  // Registration validation
  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name cannot exceed 50 characters",
      "any.required": "Name is required",
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

    password: Joi.string()
      .min(8)
      // .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        // "string.pattern.base":
        //   "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "Password is required",
      }),

    referralCode: Joi.string().optional().allow(""),
  }),

  // Login validation
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),

    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),

  // Refresh token validation
  refreshToken: Joi.object({
    refreshToken: Joi.string().required().messages({
      "any.required": "Refresh token is required",
    }),
  }),

  // Profile update validation
  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),

    email: Joi.string().email().optional(),
  }),

  // Change password validation
  changePassword: Joi.object({
    currentPassword: Joi.string().required().messages({
      "any.required": "Current password is required",
    }),

    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
      .required()
      .messages({
        "string.min": "New password must be at least 8 characters long",
        "string.pattern.base":
          "New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
        "any.required": "New password is required",
      }),
  }),

  // Create join code validation
  createJoinCode: Joi.object({
    organizationId: Joi.number().min(1).required().messages({
      "number.min": "Organization ID is not given",
      "any.required": "Organization ID is required",
    }),
    usageLimit: Joi.number().min(1).optional().messages({
      "number.min": "Usage limit must be at least 1",
      "any.required": "Usage limit is optional",
    }),
    expiresAt: Joi.date().greater("now").optional().messages({
      "date.greater": "Expiration date must be in the future",
      "any.required": "Expiration date is optional",
    }),
    role: Joi.string()
      .valid(...Object.values(UserRole))
      .required()
      .messages({
        "any.only": `Role must be one of ${Object.values(UserRole).join(", ")}`,
        "any.required": "Role is required",
      }),
  }),
  updateJoinCode: Joi.object({
    usageLimit: Joi.number().min(1).optional().messages({
      "number.min": "Usage limit must be at least 1",
      "any.required": "Usage limit is optional",
    }),
    expiresAt: Joi.date().greater("now").optional().messages({
      "date.greater": "Expiration date must be in the future",
      "any.required": "Expiration date is optional",
    }),
    id: Joi.number().min(1).messages({
      "number.min": "Id must be atleast present",
      "any.required": "Id is mandatory",
    }),
  }),
};

export { validationSchemas };
