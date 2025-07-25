import { prisma } from "@repo/database";

/**
 * Get organizations for a user
 * @param userId - The ID of the user
 * @returns A list of organizations the user belongs to with role attached
 */
export const getUserOrganizations = async (userId: string) => {
  try {
    const memberShips = await prisma.organizationMembership.findMany({
      where: { userId: Number(userId) },
      include: { organization: true },
    });
    return memberShips.map((membership) => ({
      ...membership.organization,
      role: membership.role,
    }));
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    throw error;
  }
};

export const getOrganization = async (orgId: string) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: Number(orgId) },
    });
    return organization;
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    throw error;
  }
};
