import jwt, { JwtPayload, SignOptions, Secret } from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";
if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET in env");

const accessTokenSecret: Secret = process.env.JWT_SECRET;
const refreshTokenSecret: Secret =
  process.env.JWT_REFRESH_SECRET ?? "default-refresh-secret";

const accessTokenExpiry: string = process.env.JWT_ACCESS_EXPIRY ?? "15m";
const refreshTokenExpiry: string = process.env.JWT_REFRESH_EXPIRY ?? "7d";

const defaultJwtOptions: SignOptions = {
  issuer: "study-sync",
  audience: "study-sync-users",
};

export interface JwtUserPayload {
  id: string;
  email: string;
  role?: string;
  name?: string;
  organizationId?: number;
  organizationName?: string;
}

export const generateAccessToken = (payload: JwtUserPayload): string => {
  return jwt.sign(payload, accessTokenSecret, {
    ...defaultJwtOptions,
    expiresIn: accessTokenExpiry,
  });
};

export const generateRefreshToken = (
  payload: Pick<JwtUserPayload, "id" | "email">
): string => {
  return jwt.sign(payload, refreshTokenSecret, {
    ...defaultJwtOptions,
    expiresIn: refreshTokenExpiry,
  });
};

export const generateOrganizationsToken = (): string => {};

export const generateTokenPair = (
  user: JwtUserPayload
): { token: string; refreshToken: string } => {
  return {
    token: generateAccessToken(user),
    refreshToken: generateRefreshToken({ id: user.id, email: user.email }),
  };
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, accessTokenSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, refreshTokenSecret) as JwtPayload;
};

export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = jwt.decode(token) as JwtPayload | null;
  return !decoded?.exp || decoded.exp * 1000 < Date.now();
};
