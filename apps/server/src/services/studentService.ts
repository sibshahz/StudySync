import { prisma } from "@repo/database";
import { UserRole } from "@repo/database/enums";

export const getAllOrgStudents = async (orgId: number) => {
  try {
    const students = await prisma.student.findMany({
      where: {
        department: {
          organizationId: orgId,
        },
      },
      include: {
        department: {
          select: {
            name: true,
          },
        },
        batch: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return students;
  } catch (error) {
    console.error("Failed to fetch org students:", error);
    return [];
  }
};
