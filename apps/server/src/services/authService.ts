import bcrypt from "bcryptjs";
import * as jwtService from "./jwtService";
import { JoinCode, prisma } from "@repo/database";
import { Role } from "@repo/database";
import { JwtPayload } from "jsonwebtoken";

interface RegisterData {
  email: string;
  password: string;
  name: string;
  referralCode?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const { email, password, name, referralCode } = data;
  if (!referralCode) {
    throw new Error("Referral code is required for registration");
  }
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) throw new Error("User already exists with this email");

  const isValidReferral = await validateReferralCode(referralCode);
  if (!isValidReferral) throw new Error("Invalid referral code");

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      defaultOrg: {
        connect: { id: isValidReferral.organizationId },
      },
      roles: [isValidReferral?.role || Role.USER],
    },
  });

  const updatedJoinCode = await prisma.joinCode.update({
    where: { id: isValidReferral.id },
    data: {
      usedCount: { increment: 1 },
      updatedAt: new Date(),
    },
  });

  const organizationMembership = await prisma.organizationMembership.create({
    data: {
      userId: createdUser.id,
      organizationId: isValidReferral.organizationId,
      role: isValidReferral.role,
    },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: isValidReferral.organizationId },
    select: { name: true },
  });

  const tokens = jwtService.generateTokenPair({
    id: createdUser.id.toString(),
    email: createdUser.email,
    role: createdUser.roles[0],
    organizationId: isValidReferral.organizationId,
    organizationName: organization?.name,
    name: createdUser.name ?? undefined,
  });

  const decoded = jwtService.verifyRefreshToken(tokens.refreshToken);
  const expiresAt = new Date(decoded.exp! * 1000);

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: createdUser.id,
      expiresAt,
    },
  });

  const { password: _, ...userResponse } = createdUser;
  return { user: userResponse, ...tokens };
};

export const login = async (data: LoginData) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const tokens = jwtService.generateTokenPair({
    id: user.id.toString(),
    email: user.email,
    role: user.roles[0],
    name: user.name ?? undefined,
  });

  const decoded = jwtService.verifyRefreshToken(tokens.refreshToken);
  const expiresAt = new Date(decoded.exp! * 1000);

  await prisma.refreshToken.create({
    data: {
      token: tokens.refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  const { password: _, ...userResponse } = user;
  return { user: userResponse, ...tokens };
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const decoded = jwtService.verifyRefreshToken(refreshToken);

    const tokenRecord = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: parseInt(decoded.id),
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!tokenRecord) throw new Error("Invalid or expired refresh token");

    const user = await prisma.user.findUnique({
      where: { id: tokenRecord.userId },
    });

    if (!user) throw new Error("User not found");

    const tokens = jwtService.generateTokenPair({
      id: user.id.toString(),
      email: user.email,
      role: user.roles[0],
      name: user.name ?? undefined,
    });

    const newDecoded = jwtService.verifyRefreshToken(tokens.refreshToken);
    const newExpiresAt = new Date(newDecoded.exp! * 1000);

    await prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: {
        token: tokens.refreshToken,
        expiresAt: newExpiresAt,
      },
    });

    return tokens;
  } catch {
    throw new Error("Invalid or expired refresh token");
  }
};

export const logout = async (refreshToken: string, userId: string) => {
  await prisma.refreshToken.deleteMany({
    where: {
      token: refreshToken,
      userId: parseInt(userId),
    },
  });
};

export const logoutAll = async (userId: string) => {
  await prisma.refreshToken.deleteMany({
    where: {
      userId: parseInt(userId),
    },
  });
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    select: {
      id: true,
      email: true,
      name: true,
      roles: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new Error("User not found");
  return user;
};

export const updateProfile = async (
  userId: string,
  updateData: { name?: string; email?: string }
) => {
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      name: updateData.name,
      email: updateData.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      roles: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  const newHashed = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: newHashed,
    },
  });

  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id,
    },
  });
};

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      roles: true,
      status: true,
      createdAt: true,
    },
  });
};

export const validateReferralCode = async (
  code: string
): Promise<JoinCode | null> => {
  const validCode = await prisma.joinCode.findUnique({
    where: { code },
    select: {
      id: true,
      organizationId: true,
      role: true,
      usageLimit: true,
      usedCount: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
      code: true,
    },
  });
  if (!validCode) {
    throw new Error("Invalid referral code");
  }
  if (
    validCode.usageLimit !== null &&
    validCode.usedCount >= validCode.usageLimit
  ) {
    throw new Error("Referral code usage limit exceeded");
  }
  return validCode;
};
