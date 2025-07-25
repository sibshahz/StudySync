import { prisma } from "@repo/database";

export const getAllOrganizations = async () => {
  try {
    const organizations = await prisma.organization.findMany();
    return organizations;
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
