import express from "express";

import * as fypGroupRulesController from "./fypGroupRules.controller";
import { validate } from "@/middleware/validationMiddleware";
import { authenticate, authorize } from "@/middleware/authMiddleware";
import { UserRole } from "@repo/database/enums";

const fypGroupRulesRouter = express.Router();

fypGroupRulesRouter.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});
fypGroupRulesRouter.use(
  authorize([UserRole.TEACHER, UserRole.ADMIN])
);

// Get all FYP group rules for an organization
fypGroupRulesRouter.get("/org/:orgId", fypGroupRulesController.getAllFYPGroupRules);

// Get FYP group rules by ID
fypGroupRulesRouter.get("/:id", fypGroupRulesController.getFYPGroupRulesById);

// Get FYP group rules by batch ID
fypGroupRulesRouter.get("/batch/:batchId", fypGroupRulesController.getFYPGroupRulesByBatchId);

// Create FYP group rules for a batch
fypGroupRulesRouter.post(
  "/batch/:batchId",
  validate("createFYPGroupRules"),
  fypGroupRulesController.createFYPGroupRules
);

// Update FYP group rules for a batch
fypGroupRulesRouter.put(
  "/batch/:batchId",
  validate("updateFYPGroupRules"),
  fypGroupRulesController.updateFYPGroupRules
);

// Delete FYP group rules for a batch
fypGroupRulesRouter.delete("/batch/:batchId", fypGroupRulesController.deleteFYPGroupRules);

export default fypGroupRulesRouter;
