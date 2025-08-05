import { prisma } from "@repo/database";
import { User } from "@repo/database/enums";

export const getAllOrgMembers = async (orgId: string): Promise<User[]> => {
  try {
    const members = await prisma.user.findMany({
      where: { memberships: { some: { organizationId: Number(orgId) } } },
    });
    return members;
  } catch (error) {
    console.error("Failed to fetch org members:", error);
    return [];
  }
};
