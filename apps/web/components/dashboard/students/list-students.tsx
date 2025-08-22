"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreHorizontal,
  Users,
  UserCheck,
  AlertTriangle,
  GraduationCap,
  Building2,
} from "lucide-react";
import {
  type Student,
  Department,
  Batch,
  Status,
  getDepartmentDisplayName,
  getBatchDisplayName,
  getStatusDisplayName,
  getStatusColor,
  type AssignStudentDepartmentInput,
  type AssignStudentBatchInput,
  type PromoteStudentsInput,
  type UpdateStudentStatusInput,
} from "@/types/types";
import { AssignDepartment } from "./assign-department";
import { AssignBatch } from "./assign-batch";
import { PromoteStudents } from "./promote-students";
import { UpdateStudentStatus } from "./update-student-status";
import { getAllOrgStudents } from "@/lib/api/students";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface ListStudentsProps {
  students: Student[];
  onAssignDepartment: (data: AssignStudentDepartmentInput) => Promise<void>;
  onAssignBatch: (data: AssignStudentBatchInput) => Promise<void>;
  onPromoteStudents: (data: PromoteStudentsInput) => Promise<void>;
  onUpdateStatus: (data: UpdateStudentStatusInput) => Promise<void>;
}

export function ListStudents({
  students,
  onAssignDepartment,
  onAssignBatch,
  onPromoteStudents,
  onUpdateStatus,
}: ListStudentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  // Dialog states
  const [assignDepartmentOpen, setAssignDepartmentOpen] = useState(false);
  const [assignBatchOpen, setAssignBatchOpen] = useState(false);
  const [promoteStudentsOpen, setPromoteStudentsOpen] = useState(false);
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false);
  console.log("*** List students: ", students);
  // Filter students
  const filteredStudents = useMemo(() => {
    return students?.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.studentId &&
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDepartment =
        departmentFilter === "all" ||
        (departmentFilter === "unassigned" && !student.department) ||
        student.department === departmentFilter;

      const matchesBatch =
        batchFilter === "all" ||
        (batchFilter === "unassigned" && !student.batch) ||
        student.batch === batchFilter;

      const matchesStatus =
        statusFilter === "all" || student.status === statusFilter;

      return (
        matchesSearch && matchesDepartment && matchesBatch && matchesStatus
      );
    });
  }, [students, searchTerm, departmentFilter, batchFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = students?.length;
    const active = students?.filter((s) => s.status === Status.ACTIVE)?.length;
    const unassignedDept = students?.filter((s) => !s.department)?.length;
    const unassignedBatch = students?.filter((s) => !s.batch)?.length;

    return { total, active, unassignedDept, unassignedBatch };
  }, [students]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(filteredStudents?.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleSelectStudent = (studentId: number, checked: boolean) => {
    if (checked) {
      setSelectedStudentIds((prev) => [...prev, studentId]);
    } else {
      setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const clearSelection = () => {
    setSelectedStudentIds([]);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Students
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unassigned Dept
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.unassignedDept}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unassigned Batch
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.unassignedBatch}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
          <CardDescription>
            Manage students, assign departments and batches, and track their
            progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {Object.values(Department)?.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {getDepartmentDisplayName(dept)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {Object.values(Batch).map((batch) => (
                    <SelectItem key={batch} value={batch}>
                      {getBatchDisplayName(batch)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.values(Status).map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusDisplayName(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedStudentIds?.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">
                  {selectedStudentIds?.length} student(s) selected
                </span>
                <div className="flex gap-2 ml-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAssignDepartmentOpen(true)}
                  >
                    Assign Department
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAssignBatchOpen(true)}
                  >
                    Assign Batch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPromoteStudentsOpen(true)}
                  >
                    Promote
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setUpdateStatusOpen(true)}
                  >
                    Update Status
                  </Button>
                  <Button size="sm" variant="ghost" onClick={clearSelection}>
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedStudentIds?.length === filteredStudents?.length &&
                      filteredStudents?.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrollment Year</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No students found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents?.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudentIds.includes(student.id)}
                        onCheckedChange={(checked) =>
                          handleSelectStudent(student.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {student.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {student.studentId || (
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-200"
                        >
                          Not Set
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {student.department ? (
                        <Badge variant="outline">{student.department}</Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-200"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Unassigned
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {student?.batch ? (
                        <Badge variant="outline">{student.batch.name}</Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-red-600 border-red-200"
                        >
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Unassigned
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(student.status)}>
                        {getStatusDisplayName(student.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.enrollmentYear || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudentIds([student.id]);
                              setAssignDepartmentOpen(true);
                            }}
                          >
                            Assign Department
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudentIds([student.id]);
                              setAssignBatchOpen(true);
                            }}
                          >
                            Assign Batch
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudentIds([student.id]);
                              setPromoteStudentsOpen(true);
                            }}
                          >
                            Promote Student
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedStudentIds([student.id]);
                              setUpdateStatusOpen(true);
                            }}
                          >
                            Update Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AssignDepartment
        students={students}
        selectedStudentIds={selectedStudentIds}
        open={assignDepartmentOpen}
        onOpenChange={setAssignDepartmentOpen}
        onAssign={onAssignDepartment}
      />

      <AssignBatch
        students={students}
        selectedStudentIds={selectedStudentIds}
        open={assignBatchOpen}
        onOpenChange={setAssignBatchOpen}
        onAssign={onAssignBatch}
      />

      <PromoteStudents
        students={students}
        selectedStudentIds={selectedStudentIds}
        open={promoteStudentsOpen}
        onOpenChange={setPromoteStudentsOpen}
        onPromote={onPromoteStudents}
      />

      <UpdateStudentStatus
        students={students}
        selectedStudentIds={selectedStudentIds}
        open={updateStatusOpen}
        onOpenChange={setUpdateStatusOpen}
        onUpdateStatus={onUpdateStatus}
      />
    </div>
  );
}
