import express from "express";
import * as semesterController from "./semester.controller";
import { validate } from "@/middleware/validationMiddleware";
import { authenticate, authorize } from "@/middleware/authMiddleware";
import { UserRole } from "@repo/database/enums";

const semesterRouter = express.Router();

// Apply authentication middleware to all routes
semesterRouter.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});

// Apply authorization middleware (allow ADMIN, TEACHER, and STUDENT to view semesters)
semesterRouter.use(
  authorize([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN])
);

// Get all available semesters (not tied to a specific batch)
semesterRouter.get("/available", semesterController.getAllAvailableSemesters);

// Get all semesters for a specific batch
semesterRouter.get("/batch/:batchId", semesterController.getAllSemesters);

// Get batch semester enrollment details
semesterRouter.get(
  "/batch/:batchId/enrollment",
  semesterController.getBatchSemesterEnrollment
);

// Get a single semester by ID
semesterRouter.get("/:semesterId", semesterController.getSingleSemester);

// Only ADMIN and TEACHER can create, update, delete semesters and manage enrollments
semesterRouter.use(authorize([UserRole.TEACHER, UserRole.ADMIN]));

// Create a new semester
semesterRouter.post(
  "/",
  validate("createSemester"),
  semesterController.createSemester
);

// Update a semester
semesterRouter.put(
  "/:semesterId",
  validate("updateSemester"),
  semesterController.updateSemester
);

// Delete a semester
semesterRouter.delete("/:semesterId", semesterController.deleteSemester);

// Enroll a batch in a semester
semesterRouter.post(
  "/batch/:batchId/enroll/:semesterId",
  semesterController.enrollBatchInSemester
);

// Unenroll a batch from a semester
semesterRouter.delete(
  "/batch/:batchId/unenroll/:semesterId",
  semesterController.unenrollBatchFromSemester
);

export default semesterRouter;
