import express from "express";
import authRouter from "./auth/auth.router";
const api = express.Router();

api.use("/auth", authRouter);
api.get("/params", (req, res) => {
  res.json({
    message: req.query,
  });
});
export default api;
