import bcrypt from "bcryptjs";
import * as jwtService from "./jwtService";
import { JoinCode, prisma } from "@repo/database";
import { Role } from "@repo/database";
import { JwtPayload } from "jsonwebtoken";
import { ref } from "process";
import { UserStatus } from "@repo/database/enums";

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

const registerAdmin = async (data: RegisterData) => {
  // if user exists as an admin return error
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true, defaultOrg: true, roles: true },
  });
  if (existingUser && existingUser.defaultOrg) {
    throw new Error("User cannot be registered as an admin, already exists");
  }

  if (existingUser && existingUser.defaultOrg !== null) {
    // create default organization for the user
    const organization = await prisma.organization.create({
      data: {
        name: `${data.name}'s Organization`,
        adminId: existingUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const organizationMembership = await prisma.organizationMembership.create({
      data: {
        userId: existingUser.id,
        organizationId: organization.id,
        role: Role.ADMIN,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        defaultOrg: {
          connect: { id: organization.id },
        },
        roles: [...(existingUser.roles || []), Role.ADMIN],
      },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        defaultOrg: true,
      },
    });
    const tokens = jwtService.generateTokenPair({
      id: updatedUser.id.toString(),
      email: updatedUser.email,
      role: updatedUser.roles[0],
      organizationId: organization.id,
      organizationName: organization?.name,
      name: updatedUser.name ?? undefined,
    });

    const decoded = jwtService.verifyRefreshToken(tokens.refreshToken);
    const expiresAt = new Date(decoded.exp! * 1000);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: updatedUser.id,
        expiresAt,
      },
    });

    const { ...userResponse } = updatedUser;
    return { user: userResponse, ...tokens };
  } else if (!existingUser) {
    // create new user with default organization
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const createdUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        status: UserStatus.ACTIVE,
        roles: [Role.ADMIN],
        // defaultOrg: {
        //   create: {
        //     name: `${data.name}'s Organization`,
        //   },
        // },
      },
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        defaultOrg: true,
      },
    });
    const organization = await prisma.organization.create({
      data: {
        name: `${data.name}'s Organization`,
        adminId: createdUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const organizationMembership = await prisma.organizationMembership.create({
      data: {
        userId: createdUser.id,
        organizationId: organization.id,
        role: Role.ADMIN,
      },
    });
    const tokens = jwtService.generateTokenPair({
      id: createdUser.id.toString(),
      email: createdUser.email,
      role: createdUser.roles[0],
      organizationId: organization.id,
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

    const { ...userResponse } = createdUser;
    return { user: userResponse, ...tokens };
  }
};

export const register = async (data: RegisterData) => {
  const { email, password, name, referralCode } = data;

  if (!referralCode) {
    // Register as admin if no referral code is provided
    const result = await registerAdmin(data);
    return result;
  }

  /**
   * If there is a referral code, validate it and register the user
   * check if user already exists with the email
   * if user exists, check if they are already registered with the referral code
   * if they are not registered with the said organization register them
   *
   * if they are registered with the organization, throw an error
   *
   * if they do not exist already create new user with the referral code
   *
   *
   */

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  const existingMembership = await prisma.organizationMembership.findFirst({
    where: {
      user: { email },
      organization: { joinCodes: { some: { code: referralCode } } },
    },
  });

  if (existingUser && existingMembership) {
    throw new Error("User already registered with this referral code");
  }

  const isValidReferral = await validateReferralCode(referralCode);
  if (!isValidReferral) throw new Error("Invalid referral code");

  const hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      status: UserStatus.ACTIVE,
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
