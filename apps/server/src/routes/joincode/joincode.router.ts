import express from "express";

import * as joincodeController from "./joincode.controller";
import { validate } from "@/middleware/validationMiddleware";
import { authenticate, authorize } from "@/middleware/authMiddleware";

const joincodeRouter = express.Router();

// Public routes
joincodeRouter.get("/:joincodeId", joincodeController.getJoinCodeById);

// Protected routes
joincodeRouter.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});
joincodeRouter.post(
  "/create",
  validate("createJoinCode"),
  joincodeController.createJoinCode
);

// joincodeRouter.use(authorize("admin"));

joincodeRouter.put(
  "/update",
  validate("updateJoinCode"),
  joincodeController.updateJoinCode
);
joincodeRouter.delete("/:joincodeId", joincodeController.deleteJoinCode);
joincodeRouter.get("/orgs/:orgId", joincodeController.getOrganizationJoinCodes);

export default joincodeRouter;
