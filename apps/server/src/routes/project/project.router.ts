import express from "express";

import * as projController from "./project.controller";
import { validate } from "@/middleware/validationMiddleware";
import { authenticate, authorize } from "@/middleware/authMiddleware";
import { UserRole } from "@repo/database/enums";

const projRouter = express.Router();

// Public routes
// projRouter.post("/create", validate("createProject"), projController.createProject);
// projRouter.get("/:projId", validate("getProject"), projController.getProject);

// Protected routes
projRouter.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});
projRouter.use(authorize([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN]));

// projRouter.put("/:projId", validate("updateProject"), projController.FYPProjectAssignmentUpdateWithoutProjectInput);
// projRouter.delete("/:projId", validate("deleteProject"), projController.deleteProject);
projRouter.get("/", projController.getAllProjects);
// projRouter.get(
//   "/:projId",
//   validate("getProject"),
//   projController.getProject
// );

export default projRouter;
