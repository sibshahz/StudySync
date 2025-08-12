import express from "express";
import authRouter from "./auth/auth.router";
import orgRouter from "./organization/org.router";
import joincodeRouter from "./joincode/joincode.router";
import projRouter from "./project/project.router";
import memberRouter from "./member/members.router";
import departmentRouter from "./department/department.router";
import batchRouter from "./batches/batch.router";

const api = express.Router();

api.use("/auth", authRouter);
api.use("/org", orgRouter);
api.use("/joincode", joincodeRouter);
api.use("/project", projRouter);
api.use("/members", memberRouter);
api.use("/departments", departmentRouter);
api.use("/batch", batchRouter);
api.get("/params", (req, res) => {
  res.json({
    message: req.query,
  });
});
export default api;
