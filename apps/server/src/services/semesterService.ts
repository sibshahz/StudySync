import { prisma } from "@repo/database";
import { SemesterSeason } from "@repo/database/enums";

export const getAllSemesters = async (batchId: string) => {
  try {
    // Get all semesters and filter by students from the specific batch
    const semesters = await prisma.semester.findMany({
      include: {
        students: {
          where: {
            batchId: Number(batchId),
          },
          select: {
            id: true,
            name: true,
            rollNo: true,
          },
        },
        courses: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        _count: {
          select: {
            students: true,
            courses: true,
          },
        },
      },
    });

    // Filter semesters that have students from the specific batch
    const batchSemesters = semesters.filter(
      (semester) => semester.students.length > 0
    );

    return batchSemesters;
  } catch (error) {
    console.error("Failed to fetch semesters:", error);
    return [];
  }
};

export const getAllAvailableSemesters = async () => {
  try {
    const semesters = await prisma.semester.findMany({
      include: {
        _count: {
          select: {
            students: true,
            courses: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });
    return semesters;
  } catch (error) {
    console.error("Failed to fetch available semesters:", error);
    return [];
  }
};

export const getSingleSemester = async (semesterId: string) => {
  try {
    const semester = await prisma.semester.findUnique({
      where: {
        id: Number(semesterId),
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            rollNo: true,
            email: true,
            batch: {
              select: {
                id: true,
                name: true,
                batchCode: true,
              },
            },
          },
        },
        courses: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });
    return semester;
  } catch (error) {
    console.error("Failed to fetch semester:", error);
    return null;
  }
};

export const createSemester = async (
  name: string,
  semesterSeason: SemesterSeason,
  startDate: Date,
  endDate: Date
) => {
  try {
    const newSemester = await prisma.semester.create({
      data: {
        name,
        semesterSeason,
        startDate,
        endDate,
      },
    });
    return newSemester;
  } catch (error) {
    console.error("Failed to create semester:", error);
    return null;
  }
};

export const updateSemester = async (
  semesterId: string,
  name: string,
  semesterSeason: SemesterSeason,
  startDate: Date,
  endDate: Date
) => {
  try {
    const updatedSemester = await prisma.semester.update({
      where: {
        id: Number(semesterId),
      },
      data: {
        name,
        semesterSeason,
        startDate,
        endDate,
      },
    });
    return updatedSemester;
  } catch (error) {
    console.error("Failed to update semester:", error);
    return null;
  }
};

export const deleteSemester = async (semesterId: string) => {
  try {
    const deletedSemester = await prisma.semester.delete({
      where: {
        id: Number(semesterId),
      },
    });
    return deletedSemester;
  } catch (error) {
    console.error("Failed to delete semester:", error);
    return null;
  }
};

export const enrollBatchInSemester = async (
  batchId: string,
  semesterId: string
) => {
  try {
    // Get all students from the batch
    const batchStudents = await prisma.student.findMany({
      where: {
        batchId: Number(batchId),
      },
    });

    if (batchStudents.length === 0) {
      throw new Error("No students found in this batch");
    }

    // Enroll all students in the semester
    const semester = await prisma.semester.update({
      where: {
        id: Number(semesterId),
      },
      data: {
        students: {
          connect: batchStudents.map((student) => ({ id: student.id })),
        },
      },
      include: {
        students: {
          where: {
            batchId: Number(batchId),
          },
        },
      },
    });

    return semester;
  } catch (error) {
    console.error("Failed to enroll batch in semester:", error);
    return null;
  }
};

export const unenrollBatchFromSemester = async (
  batchId: string,
  semesterId: string
) => {
  try {
    // Get all students from the batch
    const batchStudents = await prisma.student.findMany({
      where: {
        batchId: Number(batchId),
      },
    });

    if (batchStudents.length === 0) {
      throw new Error("No students found in this batch");
    }

    // Unenroll all students from the semester
    const semester = await prisma.semester.update({
      where: {
        id: Number(semesterId),
      },
      data: {
        students: {
          disconnect: batchStudents.map((student) => ({ id: student.id })),
        },
      },
    });

    return semester;
  } catch (error) {
    console.error("Failed to unenroll batch from semester:", error);
    return null;
  }
};

export const getBatchSemesterEnrollment = async (batchId: string) => {
  try {
    // Get the batch with its students and their enrolled semesters
    const batch = await prisma.batch.findUnique({
      where: {
        id: Number(batchId),
      },
      include: {
        students: {
          include: {
            semesters: {
              select: {
                id: true,
                name: true,
                semesterSeason: true,
                startDate: true,
                endDate: true,
              },
            },
          },
        },
      },
    });

    if (!batch) {
      return null;
    }

    // Get unique semesters enrolled by students in this batch
    const enrolledSemesters = new Map();
    batch.students.forEach((student) => {
      student.semesters.forEach((semester) => {
        enrolledSemesters.set(semester.id, semester);
      });
    });

    return {
      batch: {
        id: batch.id,
        name: batch.name,
        batchCode: batch.batchCode,
        studentCount: batch.students.length,
      },
      enrolledSemesters: Array.from(enrolledSemesters.values()),
    };
  } catch (error) {
    console.error("Failed to get batch semester enrollment:", error);
    return null;
  }
};
