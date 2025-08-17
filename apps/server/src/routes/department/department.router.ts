import express from "express";

import * as departmentController from "./department.controller";
import { validate } from "@/middleware/validationMiddleware";
import { authenticate, authorize } from "@/middleware/authMiddleware";
import { UserRole } from "@repo/database/enums";

const deptRouter = express.Router();

deptRouter.use((req, res, next) => {
  Promise.resolve(authenticate(req, res, next)).catch(next);
});
deptRouter.use(authorize([UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN]));
/**Get all departments in an organization */
deptRouter.get("/:orgId", departmentController.getAllDepartments);

// get a single department details in an organization
deptRouter.get("/:orgId/:deptId", departmentController.getSingleDepartment);

deptRouter.post(
  "/:orgId",
  validate("createDepartment"),
  departmentController.createDepartment
);

deptRouter.post(
  "/:orgId/:deptId",
  validate("addDepartmentStudent"),
  departmentController.addDepartmentStudent
);

deptRouter.put(
  "/:orgId/:deptId",
  validate("updateDepartment"),
  departmentController.updateDepartment
);
deptRouter.delete("/:orgId/:deptId", departmentController.deleteDepartment);

export default deptRouter;
