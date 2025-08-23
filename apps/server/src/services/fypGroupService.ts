import { prisma } from "@repo/database";

export const getAllFYPGroups = async (
  orgId: number,
  deptId: number,
  batchId: number
) => {
  try {
    // Get all groups
    const fypGroups = await prisma.fYPGroup.findMany({
      where: {
        departmentId: deptId,
        batchId: batchId,
      },
      include: {
        students: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // For each group, fetch its project and embed it
    const groupsWithProject = await Promise.all(
      fypGroups.map(async (group) => {
        const project = await prisma.fYPProjects.findUnique({
          where: { id: group.projectId },
        });
        return {
          ...group,
          project, // embed the project object
        };
      })
    );

    return groupsWithProject;
  } catch (error: any) {
    throw new Error(`Failed to retrieve FYP groups: ${error.message}`);
  }
};
