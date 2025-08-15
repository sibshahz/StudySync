import { prisma } from "@repo/database";

export const getAllFYPGroupRules = async (orgId: string) => {
  try {
    const departments = await prisma.departments.findMany({
      where: { organizationId: Number(orgId) },
      include: {
        batches: {
          include: {
            FYPGroupRules: true,
          },
        },
      },
    });

    const groupRules = departments.flatMap((department) =>
      department.batches.map((batch) => ({
        ...batch.FYPGroupRules,
        batchId: batch.id,
        batchName: batch.name,
        departmentId: department.id,
        departmentName: department.name,
      }))
    );

    return groupRules;
  } catch (error) {
    console.error("Failed to fetch FYP group rules:", error);
    return [];
  }
};

export const getFYPGroupRulesByBatchId = async (batchId: string) => {
  try {
    const groupRules = await prisma.fYPGroupRules.findUnique({
      where: {
        batchId: Number(batchId),
      },
      include: {
        batch: {
          include: {
            department: true,
          },
        },
      },
    });
    return groupRules;
  } catch (error) {
    console.error("Failed to fetch FYP group rules by batch ID:", error);
    return null;
  }
};

export const createFYPGroupRules = async (
  batchId: string,
  minMembers: number,
  maxMembers: number
) => {
  try {
    const newGroupRules = await prisma.fYPGroupRules.create({
      data: {
        batchId: Number(batchId),
        minMembers,
        maxMembers,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        batch: {
          include: {
            department: true,
          },
        },
      },
    });
    return newGroupRules;
  } catch (error) {
    console.error("Failed to create FYP group rules:", error);
    return null;
  }
};

export const updateFYPGroupRules = async (
  batchId: string,
  minMembers?: number,
  maxMembers?: number
) => {
  try {
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (minMembers !== undefined) {
      updateData.minMembers = minMembers;
    }

    if (maxMembers !== undefined) {
      updateData.maxMembers = maxMembers;
    }

    const updatedGroupRules = await prisma.fYPGroupRules.update({
      where: {
        batchId: Number(batchId),
      },
      data: updateData,
      include: {
        batch: {
          include: {
            department: true,
          },
        },
      },
    });
    return updatedGroupRules;
  } catch (error) {
    console.error("Failed to update FYP group rules:", error);
    return null;
  }
};

export const deleteFYPGroupRules = async (batchId: string) => {
  try {
    const deletedGroupRules = await prisma.fYPGroupRules.delete({
      where: {
        batchId: Number(batchId),
      },
    });
    return deletedGroupRules;
  } catch (error) {
    console.error("Failed to delete FYP group rules:", error);
    return null;
  }
};

export const getFYPGroupRulesById = async (id: string) => {
  try {
    const groupRules = await prisma.fYPGroupRules.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        batch: {
          include: {
            department: true,
          },
        },
      },
    });
    return groupRules;
  } catch (error) {
    console.error("Failed to fetch FYP group rules by ID:", error);
    return null;
  }
};
