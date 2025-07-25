import express from "express";

import * as orgController from "./org.controller";
import { validate } from "@/middleware/validationMiddleware";
import { authenticate, authorize } from "@/middleware/authMiddleware";

const orgRouter = express.Router();

// Public routes
// orgRouter.post("/create", validate("createOrganization"), orgController.createOrganization);
// orgRouter.get("/:orgId", validate("getOrganization"), orgController.getOrganization);

// Protected routes
orgRouter.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});
// orgRouter.use(authorize("admin"));

// orgRouter.put("/:orgId", validate("updateOrganization"), orgController.updateOrganization);
// orgRouter.delete("/:orgId", validate("deleteOrganization"), orgController.deleteOrganization);
orgRouter.get("/", orgController.getUserAllOrganizations);
// orgRouter.get(
//   "/:orgId",
//   validate("getOrganization"),
//   orgController.getOrganization
// );

export default orgRouter;
