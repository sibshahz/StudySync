import { Request, Response, NextFunction } from "express";
import * as jwtService from "@/services/jwtService";
import * as authService from "@/services/authService";
import { user } from "@elevenlabs/elevenlabs-js/api";

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
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required",
      });
    }

    const decoded = jwtService.verifyAccessToken(token); // You might want to wrap in try-catch
    const user = await authService.getProfile(decoded.id);
    console.log("*** DECODED USER: ", user);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found in authenticate method",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
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
      return;
    }

    const userRoles =
      Array.isArray(req.user.roles) ? req.user.roles : [req.user.role];
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    const hasPermission = requiredRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        message:
          "Insufficient permissions" +
          JSON.stringify(req.user) +
          " AND " +
          requiredRoles,
      });
      return;
    }

    next();
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
    const token = req.cookies?.token;

    if (token) {
      const decoded = jwtService.verifyAccessToken(token);
      const user = await authService.getProfile(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch {
    // Ignore if token is missing or invalid
  }

  next();
};
