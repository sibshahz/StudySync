import express from "express";
import * as authController from "./auth.controller";
import { validate } from "@/middleware/validationMiddleware";
import { authenticate, authorize } from "@/middleware/authMiddleware";

const authRouter = express.Router();

// Public routes
authRouter.post("/register", validate("register"), authController.register);
authRouter.post("/login", validate("login"), authController.login);
authRouter.post(
  "/refresh",
  validate("refreshToken"),
  authController.refreshToken
);

authRouter.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});

authRouter.post("/logout", authController.logout);
authRouter.post("/logout-all", authController.logoutAll);
authRouter.get("/profile", authController.getProfile);
authRouter.put(
  "/profile",
  validate("updateProfile"),
  authController.updateProfile
);
authRouter.put(
  "/change-password",
  validate("changePassword"),
  authController.changePassword
);
authRouter.get("/validate", authController.validateToken);

// Admin-only
authRouter.get("/users", authorize(["admin"]), authController.getAllUsers);

export default authRouter;
