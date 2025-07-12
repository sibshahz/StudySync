import {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { prisma } from "@repo/database";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;

export const httpRegisterUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    console.log("SIGNUP WAS HIT");
    const userExists = await prisma.user.findUnique({
      where: { email },
    });
    if (userExists) {
      res.status(400).send({ error: "User with this email already exists!" });
      return;
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const token = jwt.sign(
      { email: user.email, id: user.id },
      JWT_SECRET as string
    );
    // res.cookie("token", token, { httpOnly: true });
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(201).send({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    res.status(400).send({ error: "Error creating user!" });
    return;
  }
};

export const httpLoginUser = async (req: Request, res: Response) => {
  try {
    console.log("SIGNIN CALLED");
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.clearCookie("token");
      res.status(401).send({ error: "Invalid credentials!" });
      return;
    }
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET as string
    );
    res.cookie("token", token, { httpOnly: true, secure: true });
    res.status(200).send({
      id: user.id,
      email: user.email,
    });
  } catch (err) {
    res.clearCookie("token");
    res.status(401).send({ error: "Invalid credentials!" });
    return;
  }
};

export const httpLogoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).send("Logged out!");
};

export const httpGetUser = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;

    if (!user) {
      res.clearCookie("token");
      res.status(403).send({ error: "Unauthorized" });
      return;
    }

    res.status(200).send({
      id: user.id || "",
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.clearCookie("token");
    res.status(403).send({ error: "Invalid token: " + err });
    return;
  }
};

export const httpUpdateUser = async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send({ error: "Unauthorized" + token });
    return;
  }

  const user = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;

  if (!user) {
    res.clearCookie("token");
    res.status(403).send({ error: "Unauthorized" });
    return;
  }
  const { email, oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    res.status(401).send({ error: "Passwords do not match!" });
    return;
  }

  const userProfile = await prisma.user.findUnique({
    where: { email },
  });

  if (
    !userProfile ||
    !(await bcrypt.compare(oldPassword, userProfile.password))
  ) {
    res.status(401).send({ error: "Invalid credentials!" });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { email: userProfile.email },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).send({
      message: "Password updated successfully!",
    });
  } catch (err) {
    res.clearCookie("token");
    res.status(403).send({ error: "Error updating user password" });
    return;
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const token= req.cookies.token
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  try {
    const user = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;

    if (!user) {
      res.clearCookie("token");
      res.status(403).send({ error: "Unauthorized" });
      return;
    } else {
      req.user = user;
      next();
    }
    // next();
  } catch (err) {
    res.clearCookie("token");
    res.status(403).send({ error: "Invalid token" });
  }
};

// export const authenticate = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res
//       .status(401)
//       .json({ error: "Missing or malformed Authorization header" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const user = jwt.verify(token, JWT_SECRET as string) as jwt.JwtPayload;

//     if (!user) {
//       return res.status(403).json({ error: "Unauthorized" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     return res.status(403).json({ error: "Invalid token" });
//   }
// };
