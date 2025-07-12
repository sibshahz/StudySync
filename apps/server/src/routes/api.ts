import express from "express";
import authRouter from "./auth/auth.router";
import agentRouter from "./agents/agents.router";
import { authenticate } from "./auth/auth.controller";
const api = express.Router();

api.use("/auth", authRouter);
api.use("/agents", authenticate, agentRouter);
api.get("/params", (req, res) => {
  res.json({
    message: req.query,
  });
});
export default api;
