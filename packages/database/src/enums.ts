// packages/database/src/enums.ts
import * as PrismaClient from "../generated/prisma";

export const UserRole = PrismaClient.Role;
export type UserRole = PrismaClient.Role;

export const UserStatus = PrismaClient.UserStatus;
export type UserStatus = PrismaClient.UserStatus;

export const SemesterSeason = PrismaClient.SemesterSeason;
export type SemesterSeason = PrismaClient.SemesterSeason;

export const QuestionType = PrismaClient.QuestionType;
export type QuestionType = PrismaClient.QuestionType;

export type OrganizationMember = PrismaClient.OrganizationMembership;

export type Organization = PrismaClient.Organization;

export type JoinCode = PrismaClient.JoinCode;

export type User = PrismaClient.User;

export type Departments = PrismaClient.Departments;

export type Teacher = PrismaClient.Teacher;

export type Batch = PrismaClient.Batch;

export type Semester = PrismaClient.Semester;

export type Student = PrismaClient.Student;

export type Courses = PrismaClient.Courses;

export type FYPGroup = PrismaClient.FYPGroup;

export type FYPProjects = PrismaClient.FYPProjects;

export type FYPPorjectAssignment = PrismaClient.FYPProjectAssignment;

export type Assignment = PrismaClient.Assignment;

export type AssignmentSubmission = PrismaClient.AssignmentSubmission;

export type Quiz = PrismaClient.Quiz;

export type QuizQuestion = PrismaClient.QuizQuestion;

export type QuizAttempt = PrismaClient.QuizAttempt;

export type GradingScheme = PrismaClient.GradingScheme;

export type GradeItem = PrismaClient.GradeItem;