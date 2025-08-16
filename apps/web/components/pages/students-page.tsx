"use client";

import { useState } from "react";
import { ListStudents } from "@/components/dashboard/students/list-students";
import {
  type Student,
  type AssignStudentDepartmentInput,
  type AssignStudentBatchInput,
  type PromoteStudentsInput,
  type UpdateStudentStatusInput,
  Status,
  Department,
  Batch,
} from "@/types/types";

// Mock data - replace with actual API calls
const mockStudents: Student[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@university.edu",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    status: Status.ACTIVE,
    department: Department.COMPUTER_SCIENCE,
    batch: Batch.SEMESTER_3,
    studentId: "CS2024001",
    enrollmentYear: 2024,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@university.edu",
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
    status: Status.ACTIVE,
    department: Department.SOFTWARE_ENGINEERING,
    batch: Batch.SEMESTER_2,
    studentId: "SE2024002",
    enrollmentYear: 2024,
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol.davis@university.edu",
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-01-17T10:00:00Z",
    status: Status.ACTIVE,
    studentId: "EE2024003",
    enrollmentYear: 2024,
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@university.edu",
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-01-18T10:00:00Z",
    status: Status.INACTIVE,
    department: Department.MECHANICAL_ENGINEERING,
    batch: Batch.SEMESTER_1,
    studentId: "ME2024004",
    enrollmentYear: 2024,
  },
  {
    id: 5,
    name: "Eva Brown",
    email: "eva.brown@university.edu",
    createdAt: "2024-01-19T10:00:00Z",
    updatedAt: "2024-01-19T10:00:00Z",
    status: Status.ACTIVE,
    // No department or batch assigned
    studentId: "UN2024005",
    enrollmentYear: 2024,
  },
  {
    id: 6,
    name: "Frank Miller",
    email: "frank.miller@university.edu",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    status: Status.SUSPENDED,
    department: Department.BUSINESS_ADMINISTRATION,
    batch: Batch.SEMESTER_4,
    studentId: "BA2024006",
    enrollmentYear: 2024,
  },
  {
    id: 7,
    name: "Grace Lee",
    email: "grace.lee@university.edu",
    createdAt: "2024-01-21T10:00:00Z",
    updatedAt: "2024-01-21T10:00:00Z",
    status: Status.ACTIVE,
    department: Department.CIVIL_ENGINEERING,
    // No batch assigned
    studentId: "CE2024007",
    enrollmentYear: 2024,
  },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate API calls - replace with actual API integration
  const handleAssignDepartment = async (data: AssignStudentDepartmentInput) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStudents((prev) =>
        prev.map((student) =>
          data.studentIds.includes(student.id)
            ? { ...student, department: data.department }
            : student,
        ),
      );
    } catch (error) {
      throw new Error("Failed to assign department");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignBatch = async (data: AssignStudentBatchInput) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStudents((prev) =>
        prev.map((student) =>
          data.studentIds.includes(student.id)
            ? { ...student, batch: data.batch }
            : student,
        ),
      );
    } catch (error) {
      throw new Error("Failed to assign batch");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteStudents = async (data: PromoteStudentsInput) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStudents((prev) =>
        prev.map((student) =>
          data.studentIds.includes(student.id)
            ? { ...student, batch: data.newBatch }
            : student,
        ),
      );
    } catch (error) {
      throw new Error("Failed to promote students");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (data: UpdateStudentStatusInput) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStudents((prev) =>
        prev.map((student) =>
          data.studentIds.includes(student.id)
            ? { ...student, status: data.status }
            : student,
        ),
      );
    } catch (error) {
      throw new Error("Failed to update student status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground">
          Manage student records, assignments, and academic progress.
        </p>
      </div>

      <ListStudents
        students={students}
        onAssignDepartment={handleAssignDepartment}
        onAssignBatch={handleAssignBatch}
        onPromoteStudents={handlePromoteStudents}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
