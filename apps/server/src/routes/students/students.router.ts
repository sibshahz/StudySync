import express from "express";

// import * as studentController from "./students.controller";
import { validate } from "@/middleware/validationMiddleware";
import { authenticate, authorize } from "@/middleware/authMiddleware";
import { UserRole } from "@repo/database/enums";

const studentRouter = express.Router();

studentRouter.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});

// ADMIN teacher and student can access these student routes
studentRouter.use(
  authorize([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN])
);

//ADMIN and Teacher can access these student routes
studentRouter.use(authorize([UserRole.TEACHER, UserRole.ADMIN]));

//add new students
