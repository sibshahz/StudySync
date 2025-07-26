import express from "express";
import authRouter from "./auth/auth.router";
import orgRouter from "./organization/org.router";
import joincodeRouter from "./joincode/joincode.router";
const api = express.Router();

api.use("/auth", authRouter);
api.use("/org", orgRouter);
api.use("/joincode", joincodeRouter);

api.get("/params", (req, res) => {
  res.json({
    message: req.query,
  });
});
export default api;
