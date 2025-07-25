import { prisma } from "@repo/database";
import { UserRole } from "@repo/database/enums";

export const getJoinCodeById = async (id: string) => {
  return prisma.joinCode.findUnique({
    where: { id: Number(id) },
  });
};

export const getOrganizationJoinCodes = async (orgId: string) => {
  return prisma.joinCode.findMany({
    where: { organizationId: Number(orgId) },
  });
};

export const createJoinCode = async (data: {
  organizationId: string;
  usageLimit: number;
  expiresAt: Date;
  role: UserRole;
}) => {
  const existingCodes = await prisma.joinCode.findMany({
    where: { organizationId: Number(data.organizationId), role: data.role },
  });
  const str = "_";
  const code =
    data.role + str + data.organizationId + str + existingCodes.length + 1;
  return prisma.joinCode.create({
    data: {
      organizationId: Number(data.organizationId),
      usageLimit: data.usageLimit,
      expiresAt: data.expiresAt,
      code: code, // Generate a random code
      role: data.role || UserRole.USER, // Default role if not provided
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};
export const deleteJoinCode = async (id: string) => {
  return prisma.joinCode.delete({
    where: { id: Number(id) },
  });
};
