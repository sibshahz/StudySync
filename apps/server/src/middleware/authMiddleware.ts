import { Request, Response, NextFunction } from "express";
import * as jwtService from "@/services/jwtService";
import * as authService from "@/services/authService";

// Extend Express Request type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access token is required",
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = jwtService.verifyAccessToken(token);
    const user = await authService.getProfile(decoded.id);

    req.user = user;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
    return;
  }
};

/**
 * Authorization middleware factory
 * Ensures user has required role(s)
 */

export const authorize = (roles: string[] | string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return; // important
    }

    const userRole = req.user.role;
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    if (!requiredRoles.includes(userRole || "")) {
      res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
      return; // important
    }

    next(); // ✅ only if allowed
  };
};

/**
 * Optional authentication middleware
 * Adds user to request if token is valid; ignores errors
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const decoded = jwtService.verifyAccessToken(token);
      const user = await authService.getProfile(decoded.id);
      req.user = user;
    }
  } catch {
    // Optional auth: ignore token errors
  }

  next();
};
