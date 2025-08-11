import { prisma } from "@repo/database";
import { Departments } from "@repo/database/enums";

export const getAllDepartments = async (orgId: string) => {
  try {
    const departments = await prisma.departments.findMany({
      where: { organizationId: Number(orgId) },
      include: {
        _count: {
          select: {
            students: true,
            teachers: true,
            batches: true,
          },
        },
      },
    });
    return departments;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return [];
  }
};

export const getSingleDepartment = async (orgId: string, deptId: string) => {
  try {
    const department = await prisma.departments.findUnique({
      where: {
        id: Number(deptId),
        organizationId: Number(orgId),
      },
    });
    return department;
  } catch (error) {
    console.error("Failed to fetch department:", error);
    return null;
  }
};

export const createDepartment = async (orgId: string, name: string) => {
  try {
    const newDepartment = await prisma.departments.create({
      data: {
        name,
        organizationId: Number(orgId),
      },
    });
    return newDepartment;
  } catch (error) {
    console.error("Failed to create department:", error);
    return null;
  }
};

export const updateDepartment = async (
  orgId: string,
  deptId: string,
  name: string
) => {
  try {
    const updatedDepartment = await prisma.departments.update({
      where: {
        id: Number(deptId),
        organizationId: Number(orgId),
      },
      data: {
        name,
      },
    });
    return updatedDepartment;
  } catch (error) {
    console.error("Failed to update department:", error);
    return null;
  }
};

export const deleteDepartment = async (orgId: string, deptId: string) => {
  try {
    await prisma.departments.delete({
      where: {
        id: Number(deptId),
        organizationId: Number(orgId),
      },
    });
  } catch (error) {
    console.error("Failed to delete department:", error);
  }
};
