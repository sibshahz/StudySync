import bcrypt from "bcryptjs";
import * as jwtService from "./jwtService";

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: "admin" | "user";
  isEmailVerified: boolean;
  createdAt: Date;
  refreshTokens: string[];
  referralCode?: string | null;
}

// Mock database
const users: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    name: "Admin User",
    role: "admin",
    isEmailVerified: true,
    createdAt: new Date(),
    refreshTokens: [],
  },
  {
    id: "2",
    email: "user@example.com",
    password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    name: "Regular User",
    role: "user",
    isEmailVerified: true,
    createdAt: new Date(),
    refreshTokens: [],
  },
];

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

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const register = async (data: RegisterData) => {
  const { email, password, name, referralCode } = data;

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) throw new Error("User already exists with this email");

  if (referralCode) {
    const isValidReferral = await validateReferralCode(referralCode);
    if (!isValidReferral) throw new Error("Invalid referral code");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser: User = {
    id: (users.length + 1).toString(),
    email,
    password: hashedPassword,
    name,
    role: "user",
    isEmailVerified: false,
    referralCode: referralCode || null,
    createdAt: new Date(),
    refreshTokens: [],
  };

  users.push(newUser);

  const tokens = jwtService.generateTokenPair(newUser);
  newUser.refreshTokens.push(tokens.refreshToken);

  const { password: _, refreshTokens, ...userResponse } = newUser;
  return { user: userResponse, ...tokens };
};

export const login = async (data: LoginData) => {
  const { email, password } = data;

  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("Invalid credentials");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid credentials");

  if (!user.isEmailVerified)
    throw new Error("Please verify your email before logging in");

  const tokens = jwtService.generateTokenPair(user);
  user.refreshTokens.push(tokens.refreshToken);
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }

  const { password: _, refreshTokens, ...userResponse } = user;
  return { user: userResponse, ...tokens };
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const decoded = jwtService.verifyRefreshToken(refreshToken);
    const user = users.find((u) => u.id === decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      throw new Error("Invalid refresh token");
    }

    const tokens = jwtService.generateTokenPair(user);
    const index = user.refreshTokens.indexOf(refreshToken);
    user.refreshTokens[index] = tokens.refreshToken;
    return tokens;
  } catch {
    throw new Error("Invalid or expired refresh token");
  }
};

export const logout = async (refreshToken: string, userId: string) => {
  const user = users.find((u) => u.id === userId);
  if (user && refreshToken) {
    user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
  }
};

export const logoutAll = async (userId: string) => {
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.refreshTokens = [];
  }
};

export const getProfile = async (userId: string) => {
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");
  const { password, refreshTokens, ...profile } = user;
  return profile;
};

export const updateProfile = async (
  userId: string,
  updateData: Partial<Pick<User, "name" | "email">>
) => {
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  if (updateData.name !== undefined) user.name = updateData.name;
  if (updateData.email !== undefined) user.email = updateData.email;

  const { password, refreshTokens, ...profile } = user;
  return profile;
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  user.password = await bcrypt.hash(newPassword, 12);
  user.refreshTokens = [];
};

export const validateReferralCode = async (code: string): Promise<boolean> => {
  const validCodes = ["WELCOME2024", "FRIEND50", "SPECIAL100"];
  return validCodes.includes(code);
};

export const getAllUsers = async (filters: {
  role?: string;
  isEmailVerified?: boolean;
}) => {
  let filteredUsers = users.map(({ password, refreshTokens, ...u }) => u);

  if (filters.role) {
    filteredUsers = filteredUsers.filter((u) => u.role === filters.role);
  }

  if (filters.isEmailVerified !== undefined) {
    filteredUsers = filteredUsers.filter(
      (u) => u.isEmailVerified === filters.isEmailVerified
    );
  }

  return filteredUsers;
};
