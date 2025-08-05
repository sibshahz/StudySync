import { prisma } from "@repo/database";

/**
 * Get all projects
 * @returns A list of all projects
 */
export const getAllProjects = async () => {
  try {
    const projects = await prisma.fYPProjects.findMany({});
    return projects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    throw error;
  }
};
