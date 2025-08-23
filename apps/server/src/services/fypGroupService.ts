import { prisma } from "@repo/database";

export const getAllFYPGroups = async (
  orgId: number,
  deptId: number,
  batchId: number
) => {
  try {
    // get all departments

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
    return fypGroups;
  } catch (error: any) {
    throw new Error(`Failed to retrieve FYP groups: ${error.message}`);
  }
};
