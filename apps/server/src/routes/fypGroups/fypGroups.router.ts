import express from "express";
import * as fypGroupController from "./fypGroups.controller";
import { validate } from "@/middleware/validationMiddleware";

import { authenticate, authorize } from "@/middleware/authMiddleware";
import { UserRole } from "@repo/database/enums";

const fypGroupRouter = express.Router();

//public routes if any

//protected routes
fypGroupRouter.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});
fypGroupRouter.use(
  authorize([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN])
);

fypGroupRouter.get(
  "/all/:orgId/:depId/:batchId",
  fypGroupController.getAllFYPGroups
);

export default fypGroupRouter;
