import express from "express";
import {
  httpRegisterUser,
  httpLoginUser,
  httpLogoutUser,
  httpGetUser,
  httpUpdateUser,
  authenticate,
} from "@/routes/auth/auth.controller";

const authRouter = express.Router();

authRouter.post("/signup", httpRegisterUser);
authRouter.post("/signin", httpLoginUser);
authRouter.get("/me", authenticate, httpGetUser);
authRouter.put("/me", authenticate, httpUpdateUser);
authRouter.post("/logout", authenticate, httpLogoutUser);

export default authRouter;
