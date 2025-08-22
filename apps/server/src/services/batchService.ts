import { prisma } from "@repo/database";
import { validationSchemas } from "@/utils/validation";

export const getAllBatches = async (orgId: string) => {
  try {
    const departments = await prisma.departments.findMany({
      where: { organizationId: Number(orgId) },
      include: {
        batches: {
          include: {
            _count: {
              select: {
                students: true,
                // teachers: true,
              },
            },
          },
        },
      },
    });
    return departments.flatMap((dept) => {
      return dept.batches.map((batch) => ({
        ...batch,
        departmentId: dept.id,
        departmentName: dept.name,
        studentCount: batch._count.students,
        // teacherCount: batch._count.teachers,
      }));
    });
  } catch (error) {
    console.error("Failed to fetch batches:", error);
    return [];
  }
};

export const getSingleBatch = async (batchId: string) => {
  try {
    const batch = await prisma.batch.findUnique({
      where: {
        id: Number(batchId),
      },
    });
    return batch;
  } catch (error) {
    console.error("Failed to fetch batch:", error);
    return null;
  }
};

export const createBatch = async (deptId: string, name: string) => {
  try {
    const previousBatchCount = await prisma.batch.count({
      where: { departmentId: Number(deptId) },
    });
    const newBatch = await prisma.batch.create({
      data: {
        name,
        batchCode: `BATCH-${previousBatchCount + 1}`,
        batchYear: new Date().getFullYear(),
        createdAt: new Date(),

        departmentId: Number(deptId),
      },
    });
    return newBatch;
  } catch (error) {
    console.error("Failed to create batch:", error);
    return null;
  }
};

export const updateBatch = async (
  deptId: string,
  batchId: string,
  name: string
) => {
  try {
    const updatedBatch = await prisma.batch.update({
      where: {
        id: Number(batchId),
        departmentId: Number(deptId),
      },
      data: {
        name,
      },
    });
    return updatedBatch;
  } catch (error) {
    console.error("Failed to update batch:", error);
    return null;
  }
};

export const deleteBatch = async (deptId: string, batchId: string) => {
  try {
    const deletedBatch = await prisma.batch.delete({
      where: {
        id: Number(batchId),
        departmentId: Number(deptId),
      },
    });
    return deletedBatch;
  } catch (error) {
    console.error("Failed to delete batch:", error);
    return null;
  }
};

export const assignStudentBatch = async (data: any) => {
  try {
    const { studentIds, batch } = data;
    const [updatedStudents, updatedBatch] = await prisma.$transaction([
      prisma.student.updateMany({
        where: {
          userId: {
            in: studentIds.map((id: number) => Number(id)),
          },
        },
        data: {
          batchId: Number(batch),
        },
      }),
      prisma.batch.update({
        where: {
          id: Number(batch),
        },
        data: {
          students: {
            connect: studentIds.map((id: number) => ({ userId: Number(id) })),
          },
        },
      }),
    ]);
    return { updatedStudents, updatedBatch };
  } catch (error) {
    console.error("Failed to assign students to batch:", error);
    return null;
  }
};
