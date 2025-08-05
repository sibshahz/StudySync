import express from "express";

// import * as projController from "./project.controller";
import { validate } from "@/middleware/validationMiddleware";
import * as memberController from "./members.controller";
import { authenticate, authorize } from "@/middleware/authMiddleware";
import { UserRole } from "@repo/database/enums";

const memberRouter = express.Router();

// Public routes
// projRouter.post("/create", validate("createProject"), projController.createProject);
// projRouter.get("/:projId", validate("getProject"), projController.getProject);

// Protected routes
memberRouter.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});
memberRouter.use(
  authorize([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN])
);

// projRouter.put("/:projId", validate("updateProject"), projController.FYPProjectAssignmentUpdateWithoutProjectInput);
// projRouter.delete("/:projId", validate("deleteProject"), projController.deleteProject);
memberRouter.get("/:orgId", memberController.getAllOrgMembers);
// memberRouter.get(
//   "/:projId",
//   validate("getProject"),
//   projController.getProject
// );

export default memberRouter;
