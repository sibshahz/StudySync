import { Request, Response } from "express";
import * as authService from "@/services/authService";
import "dotenv/config";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);

    // Access token cookie
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: true, // must be true for cross-site cookies
      sameSite: process.env.APP_URL ? "lax" : "none", // allow cross-site
      domain:
        process.env.APP_URL ? new URL(process.env.APP_URL).hostname : undefined,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.APP_URL ? "lax" : "none", // allow cross-site
      domain:
        process.env.APP_URL ? new URL(process.env.APP_URL).hostname : undefined,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",

      token: result.token,
      refreshToken: result.refreshToken,

      user: result.user,
    });
    return;
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
    return;
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken =
      req.body.refreshToken || req.headers["x-refresh-token"];
    await authService.logout(refreshToken, req.user?.id);
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logoutAll = async (req: Request, res: Response) => {
  try {
    await authService.logoutAll(req.user?.id);
    res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // res.status(200).json({request: req})
    // return;

    const profile = await authService.getProfile(req.user?.id);
    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updated = await authService.updateProfile(req.user?.id, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(
      req.user?.id,
      currentPassword,
      newPassword
    );
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const filters = {
      role: req.query.role as string,
      isEmailVerified:
        req.query.isEmailVerified === "true" ? true
        : req.query.isEmailVerified === "false" ? false
        : undefined,
    };

    const users = await authService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
    data: {
      user: req.user,
    },
  });
};
