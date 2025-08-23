"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Building2,
  GraduationCap,
  UserCheck,
  Calendar,
  Mail,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { Group, DepartmentEntity, BatchEntity } from "@/lib/types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { fetchDepartments } from "@/lib/store/common/deptSlice";
import { fetchBatches } from "@/lib/store/common/batchSlice";
import { getFypGroups } from "@/lib/api/fypGroups";

interface GroupsPageProps {
  initialDepartments?: DepartmentEntity[];
  initialBatches?: BatchEntity[];
}

export default function FYPGroupsPage({
  initialDepartments = [],
  initialBatches = [],
}: GroupsPageProps) {
  const dispatch = useDispatch();
  const selectOrg = useSelector(
    (state: RootState) =>
      state.organizations.selectedOrganization ||
      state.organizations.userDefaultOrganization,
  );
  const orgDepartments = useSelector(
    (state: RootState) => state.departments.departments,
  );
  const orgBatches = useSelector((state: RootState) => state.batches.batches);

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
  const [batches, setBatches] = useState<BatchEntity[]>([]);
  const [filteredBatches, setFilteredBatches] = useState<BatchEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Mock data for demonstration
  const mockDepartments: DepartmentEntity[] = [
    {
      id: 1,
      departmentName: "Computer Science",
      organizationId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      organization: {
        id: 1,
        name: "University",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      studentsCount: 150,
      batchesCount: 8,
      teachersCount: 12,
      fypGroupsCount: 25,
    },
    {
      id: 2,
      departmentName: "Software Engineering",
      organizationId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      organization: {
        id: 1,
        name: "University",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      studentsCount: 120,
      batchesCount: 6,
      teachersCount: 10,
      fypGroupsCount: 20,
    },
  ];

  const mockBatches: BatchEntity[] = [
    {
      id: 1,
      name: "Fall 2024",
      batchYear: 2024,
      batchCode: "CS-F24",
      createdAt: new Date(),
      updatedAt: new Date(),
      departmentName: "Computer Science",
      departmentId: 1,
      studentsCount: 30,
      gradingSchemesCount: 5,
      fypGroupsCount: 6,
    },
    {
      id: 2,
      name: "Spring 2024",
      batchYear: 2024,
      batchCode: "CS-S24",
      createdAt: new Date(),
      updatedAt: new Date(),
      departmentName: "Computer Science",
      departmentId: 1,
      studentsCount: 28,
      gradingSchemesCount: 5,
      fypGroupsCount: 5,
    },
    {
      id: 3,
      name: "Fall 2024",
      batchYear: 2024,
      batchCode: "SE-F24",
      createdAt: new Date(),
      updatedAt: new Date(),
      departmentName: "Software Engineering",
      departmentId: 2,
      studentsCount: 25,
      gradingSchemesCount: 4,
      fypGroupsCount: 4,
    },
  ];

  const mockGroups: Group[] = [
    {
      id: 1,
      name: "Group_4_2_2",
      batchId: 2,
      departmentId: 2,
      projectId: 4,
      supervisorId: null,
      createdAt: "2025-08-22T18:41:52.860Z",
      updatedAt: "2025-08-22T18:41:52.860Z",
      students: [
        { user: { id: 10, name: "Student 4", email: "student4@gmail.com" } },
        { user: { id: 11, name: "Student 5", email: "student5@gmail.com" } },
      ],
    },
    {
      id: 2,
      name: "Group_1_1_3",
      batchId: 1,
      departmentId: 1,
      projectId: 1,
      supervisorId: 5,
      createdAt: "2025-08-20T10:30:00.000Z",
      updatedAt: "2025-08-20T10:30:00.000Z",
      students: [
        { user: { id: 1, name: "Alice Johnson", email: "alice@gmail.com" } },
        { user: { id: 2, name: "Bob Smith", email: "bob@gmail.com" } },
        { user: { id: 3, name: "Carol Davis", email: "carol@gmail.com" } },
      ],
    },
    {
      id: 3,
      name: "Group_2_1_4",
      batchId: 1,
      departmentId: 1,
      projectId: 2,
      supervisorId: 6,
      createdAt: "2025-08-21T14:15:30.000Z",
      updatedAt: "2025-08-21T14:15:30.000Z",
      students: [
        { user: { id: 4, name: "David Wilson", email: "david@gmail.com" } },
        { user: { id: 5, name: "Eva Brown", email: "eva@gmail.com" } },
        { user: { id: 6, name: "Frank Miller", email: "frank@gmail.com" } },
        { user: { id: 7, name: "Grace Taylor", email: "grace@gmail.com" } },
      ],
    },
  ];

  // Fetch departments and batches if not loaded
  useEffect(() => {
    if (selectOrg?.id) {
      if (orgDepartments.length === 0) {
        dispatch(fetchDepartments(selectOrg.id));
      }
      if (orgBatches.length === 0) {
        dispatch(fetchBatches(selectOrg.id));
      }
    }
  }, [selectOrg?.id, orgDepartments.length, orgBatches.length, dispatch]);

  // Sync local state with Redux state
  useEffect(() => {
    setDepartments(orgDepartments);
  }, [orgDepartments]);

  useEffect(() => {
    setBatches(orgBatches);
  }, [orgBatches]);

  // Set initialLoad to false when departments and batches are loaded
  useEffect(() => {
    if (departments.length > 0 || batches.length > 0) {
      setInitialLoad(false);
    }
  }, [departments, batches]);

  // Filter batches when department changes
  useEffect(() => {
    if (selectedDepartment) {
      const filtered = batches.filter(
        (batch) => batch.departmentId === Number.parseInt(selectedDepartment),
      );
      setFilteredBatches(filtered);
      setSelectedBatch(""); // Reset batch selection
      setGroups([]); // Clear groups when department changes
    } else {
      setFilteredBatches([]);
      setSelectedBatch("");
      setGroups([]);
    }
  }, [selectedDepartment, batches]);

  // Fetch groups when both department and batch are selected
  useEffect(() => {
    if (selectedDepartment && selectedBatch) {
      fetchGroups();
    }
  }, [selectedDepartment, selectedBatch]);

  const fetchGroups = async () => {
    if (!selectedDepartment || !selectedBatch) return;

    setLoading(true);
    setError(null);

    try {
      // Replace this with your actual API call
      // const response = await fetch(`/api/groups?departmentId=${selectedDepartment}&batchId=${selectedBatch}`)
      // const data = await response.json()

      // Mock API delay
      const groups = await getFypGroups(
        selectOrg.id,
        selectedDepartment,
        selectedBatch,
      );
      console.log("***Groups are: ", groups);

      // Filter mock groups based on selection
      const filteredGroups = groups.filter(
        (group) =>
          group.departmentId === Number.parseInt(selectedDepartment) &&
          group.batchId === Number.parseInt(selectedBatch),
      );

      setGroups(filteredGroups);
    } catch (err) {
      setError("Failed to fetch groups. Please try again.");
      console.error("Error fetching groups:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedDepartmentName = () => {
    const dept = departments.find(
      (d) => d.id === Number.parseInt(selectedDepartment),
    );
    return dept?.name || "";
  };

  const getSelectedBatchName = () => {
    const batch = batches.find((b) => b.id === Number.parseInt(selectedBatch));
    return batch?.name || "";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTotalStudents = () => {
    return groups.reduce((total, group) => total + group.students.length, 0);
  };

  const getSupervisedGroups = () => {
    return groups.filter((group) => group.supervisorId !== null).length;
  };

  if (initialLoad) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
        <p className="text-muted-foreground">
          Select department and batch to view student groups
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Filter Groups
          </CardTitle>
          <CardDescription>
            Choose department and batch to display groups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Department Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {dept.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Batch Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Batch</label>
              <Select
                value={selectedBatch}
                onValueChange={setSelectedBatch}
                disabled={!selectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBatches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        {batch.name} ({batch.batchCode})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedDepartment && selectedBatch && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">
                  {getSelectedDepartmentName()}
                </span>
                <span className="text-blue-500">•</span>
                <GraduationCap className="h-4 w-4" />
                <span className="font-medium">{getSelectedBatchName()}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      {selectedDepartment && selectedBatch && !loading && groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{groups.length}</p>
                  <p className="text-sm text-muted-foreground">Total Groups</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{getTotalStudents()}</p>
                  <p className="text-sm text-muted-foreground">
                    Total Students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{getSupervisedGroups()}</p>
                  <p className="text-sm text-muted-foreground">
                    Supervised Groups
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading groups...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Groups Display */}
      {selectedDepartment && selectedBatch && !loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Groups
            </CardTitle>
            <CardDescription>
              {groups.length === 0
                ? "No groups found for the selected department and batch"
                : `Showing ${groups.length} group${groups.length !== 1 ? "s" : ""} for ${getSelectedDepartmentName()} - ${getSelectedBatchName()}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {groups.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Groups Found</h3>
                <p className="text-muted-foreground">
                  There are no groups for the selected department and batch
                  combination.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {groups.map((group) => (
                  <Card key={group.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {group.name}
                          </CardTitle>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Created {formatDate(group.createdAt)}
                            </div>

                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {group.students.length} member
                              {group.students.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {group.supervisorId ? (
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800"
                            >
                              <UserCheck className="h-3 w-3 mr-1" />
                              Supervised
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-800"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" />
                              No Supervisor
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 mb-4">
                          <Badge
                            variant="outline"
                            className="mr-2 text-lg font-light"
                          >
                            <Badge variant={"default"} className="mr-2">
                              Project Name:
                            </Badge>{" "}
                            {group.project?.title}
                          </Badge>
                          <Badge variant="secondary" className="font-medium">
                            Project ID: {group.project?.id}
                          </Badge>
                        </div>
                        <h4 className="font-medium text-sm">Group Members:</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">#</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.students.map((student, index) => (
                              <TableRow key={student.user.id}>
                                <TableCell className="font-medium">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {student.user.name}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    {student.user.email}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {!selectedDepartment && !selectedBatch && (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Select Department and Batch
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Choose a department and batch from the filters above to view
              student groups and their members.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
