import express from "express";

import * as batchController from "./batch.controller";
import { validate } from "@/middleware/validationMiddleware";
import { authenticate, authorize } from "@/middleware/authMiddleware";
import { UserRole } from "@repo/database/enums";
import e from "express";

const batchRouter = express.Router();

batchRouter.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});
batchRouter.use(
  authorize([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN])
);

batchRouter.get("/org/:orgId", batchController.getAllBatches);

batchRouter.get("/batch/:batchId", batchController.getSingleBatch);

batchRouter.post(
  "/create/:deptId",
  validate("createBatch"),
  batchController.createBatch
);

batchRouter.put(
  "/:deptId/:batchId",
  validate("updateBatch"),
  batchController.updateBatch
);

batchRouter.post(
  "/assign",
  validate("addStudentBatch"),
  batchController.assignStudentBatch
);

batchRouter.delete("/:orgId/:deptId/:batchId", batchController.deleteBatch);

export default batchRouter;
