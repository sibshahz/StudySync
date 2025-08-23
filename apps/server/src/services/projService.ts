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

export const getProjectSelectionDetails = async (
  projId: number,
  userId: number
) => {
  try {
    // first getstudent details
    const student = await prisma.student.findFirst({
      where: {
        userId: userId,
      },
    });
    if (!student) {
      throw new Error("Student not found");
    }

    if (!student.batchId || !student.departmentId) {
      throw new Error("Batch ID or Department ID is not set");
    }
    // first get fypGroups where this projId, deptId and batchId is present
    const fypGroup = await prisma.fYPGroup.findFirst({
      where: {
        batchId: student.batchId,
        departmentId: student.departmentId,
        projectId: projId,
      },
    });

    //if yes then get and show the students where this fypGroup is true
    if (fypGroup) {
      const students = await prisma.student.findMany({
        where: {
          FYPGroupId: fypGroup.id,
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          batch: {
            select: {
              id: true,
              name: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return students;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch project selection details:", error);
    throw error;
  }
};

export const getSelectProject = async (projId: number, userId: number) => {
  try {
    // get batchId and deptId of the student
    const student = await prisma.student.findFirst({
      where: { userId },
      include: { batch: true, department: true },
    });

    if (!student) {
      throw new Error("Student not found");
    }

    // check if student already has a project selected then return it

    if (student.FYPGroupId) {
      throw new Error("Student already has a project selected");
    }

    const batchId = student.batch?.id;
    const departmentId = student.department?.id;

    // get existing group for this project
    let fypGroup = await prisma.fYPGroup.findFirst({
      where: {
        projectId: projId,
        batchId,
        departmentId,
      },
    });

    // get fyp rules for this batch
    const fypRules = await prisma.fYPGroupRules.findFirst({
      where: { batchId },
    });
    if (!fypRules) {
      throw new Error("FYP rules not found");
    }

    if (fypGroup) {
      // group exists → count its members
      const groupMembersCount = await prisma.student.count({
        where: { FYPGroupId: fypGroup.id },
      });

      if (groupMembersCount >= fypRules.maxMembers) {
        throw new Error(
          `Group is full. Members count: ${groupMembersCount}, Max allowed: ${fypRules.maxMembers}`
        );
      }
    } else {
      const existingGroupCount = await prisma.fYPGroup.count({
        where: {
          batchId: batchId,
          departmentId: departmentId,
        },
      });
      // no group exists → create new group
      fypGroup = await prisma.fYPGroup.create({
        // data: {
        //   projectId: projId,
        //   batchId,
        //   departmentId,
        // },
        data: {
          name: `Group-${existingGroupCount + 1}`,
          projectId: Number(projId),
          batchId: Number(batchId!),
          departmentId: Number(departmentId!),
        },
      });
    }

    // add student to group
    await prisma.student.update({
      where: { id: student.id },
      data: { FYPGroupId: fypGroup.id },
    });

    return fypGroup;
  } catch (error) {
    console.error("Failed to fetch selected project:", error);
    throw error;
  }
};

export const getStudentProjectDetails = async (studentId: number) => {
  try {
    const student = await prisma.student.findUnique({
      where: {
        userId: studentId,
      },
    });
    if (!student?.FYPGroupId) {
      throw new Error("Student has not selected any project");
    } else {
      const group = await prisma.fYPGroup.findUnique({
        where: {
          id: student.FYPGroupId,
        },
        include: {
          batch: {
            include: {
              FYPGroupRules: true,
              department: true,
            },
          },
        },
      });

      const project = await prisma.fYPProjects.findUnique({
        where: {
          id: group?.projectId,
        },
      });

      const groupMembers = await prisma.student.findMany({
        where: {
          FYPGroupId: group?.id,
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return {
        project,
        group,
        groupMembers,
      };
    }
  } catch (error) {
    console.error("Failed to fetch student project details:", error);
    throw error;
  }
};
