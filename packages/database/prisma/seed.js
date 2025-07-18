// prisma/seed.ts
import { Role, UserStatus, SemesterSeason } from '../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create organizations
  const orgs = await Promise.all([
    prisma.organization.create({ data: { name: 'StudySync University' } }),
    prisma.organization.create({ data: { name: 'TechEdge Institute' } })
  ]);

  // Create departments for each org
  const departments = await Promise.all([
    prisma.departments.create({ data: { name: 'Computer Science', organizationId: orgs[0].id } }),
    prisma.departments.create({ data: { name: 'Software Engineering', organizationId: orgs[1].id } })
  ]);

  // Create users (admin, teacher, student)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@studysync.com',
      password: hashedPassword,
      name: 'Admin User',
      status: UserStatus.ACTIVE,
      roles: [Role.ADMIN],
      memberships: { create: { organizationId: orgs[0].id, role: Role.ADMIN } }
    }
  });

  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@studysync.com',
      password: hashedPassword,
      name: 'John Doe',
      status: UserStatus.ACTIVE,
      roles: [Role.TEACHER],
      memberships: { create: { organizationId: orgs[0].id, role: Role.TEACHER } }
    }
  });

  const studentUser = await prisma.user.create({
    data: {
      email: 'student@studysync.com',
      password: hashedPassword,
      name: 'Jane Smith',
      status: UserStatus.ACTIVE,
      roles: [Role.STUDENT],
      memberships: { create: { organizationId: orgs[0].id, role: Role.STUDENT } }
    }
  });

  // Create teacher profile
  const teacher = await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
      departmentId: departments[0].id,
      designation: 'Assistant Professor'
    }
  });

  // Create batch
  const batch = await prisma.batch.create({
    data: {
      name: 'BSCS 2022',
      batchYear: 2022,
      batchCode: 'BS22',
      departmentId: departments[0].id
    }
  });

  // Create semester
  const semester = await prisma.semester.create({
    data: {
      name: 'Fall 2022',
      semesterSeason: SemesterSeason.FALL,
      startDate: new Date('2022-09-01'),
      endDate: new Date('2023-01-15')
    }
  });

  // Create student profile
  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      name: 'Jane Smith',
      email: studentUser.email,
      rollNo: 'CS2022-001',
      batchId: batch.id,
      departmentId: departments[0].id
    }
  });

  // Create a course
  const course = await prisma.courses.create({
    data: {
      name: 'Introduction to Programming',
      code: 'CS101',
      courseSemesterId: semester.id
    }
  });

  // Enroll student in course
  await prisma.courses.update({
    where: { id: course.id },
    data: { students: { connect: { id: student.id } } }
  });

  // Create quiz and assignment
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Quiz 1',
      courseId: course.id,
      teacherId: teacher.id
    }
  });

  const assignment = await prisma.assignment.create({
    data: {
      title: 'Assignment 1',
      courseId: course.id,
      teacherId: teacher.id,
      dueDate: new Date('2022-10-10')
    }
  });

  console.log('Seeding complete with organizations, users, and academic structure.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
