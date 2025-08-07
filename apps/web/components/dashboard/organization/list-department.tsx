"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  Search,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import type { DepartmentEntity } from "@/types/types";
import { EditDepartment } from "./edit-department";

interface ListDepartmentsProps {
  refreshTrigger?: number;
}

export function ListDepartments({ refreshTrigger }: ListDepartmentsProps) {
  const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<
    DepartmentEntity[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDepartment, setEditingDepartment] =
    useState<DepartmentEntity | null>(null);
  const [deletingDepartment, setDeletingDepartment] =
    useState<DepartmentEntity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Mock data for demonstration
  const mockDepartments: DepartmentEntity[] = [
    {
      id: 1,
      name: "Computer Science",
      organizationId: 1,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      organization: {
        id: 1,
        name: "University of Technology",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      studentsCount: 245,
      batchesCount: 8,
      teachersCount: 12,
      fypGroupsCount: 15,
    },
    {
      id: 2,
      name: "Software Engineering",
      organizationId: 1,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-02-01"),
      organization: {
        id: 1,
        name: "University of Technology",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      studentsCount: 189,
      batchesCount: 8,
      teachersCount: 9,
      fypGroupsCount: 12,
    },
    {
      id: 3,
      name: "Electrical Engineering",
      organizationId: 2,
      createdAt: new Date("2024-02-05"),
      updatedAt: new Date("2024-02-05"),
      organization: {
        id: 2,
        name: "State College of Engineering",
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-02-01"),
      },
      studentsCount: 156,
      batchesCount: 8,
      teachersCount: 8,
      fypGroupsCount: 10,
    },
    {
      id: 4,
      name: "Mechanical Engineering",
      organizationId: 2,
      createdAt: new Date("2024-02-10"),
      updatedAt: new Date("2024-02-10"),
      organization: {
        id: 2,
        name: "State College of Engineering",
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-02-01"),
      },
      studentsCount: 134,
      batchesCount: 8,
      teachersCount: 7,
      fypGroupsCount: 8,
    },
    {
      id: 5,
      name: "Business Administration",
      organizationId: 3,
      createdAt: new Date("2024-02-15"),
      updatedAt: new Date("2024-02-15"),
      organization: {
        id: 3,
        name: "Metropolitan University",
        createdAt: new Date("2024-02-05"),
        updatedAt: new Date("2024-02-05"),
      },
      studentsCount: 298,
      batchesCount: 8,
      teachersCount: 15,
      fypGroupsCount: 18,
    },
  ];

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      setDepartments(mockDepartments);
      setFilteredDepartments(mockDepartments);
    } catch (error) {
      toast("Failed to fetch departments", {
        description: "Unable to load departments. Please refresh the page.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (department: DepartmentEntity) => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      console.log("Deleting department:", department.id);

      const updatedDepartments = departments.filter(
        (d) => d.id !== department.id,
      );
      setDepartments(updatedDepartments);
      setFilteredDepartments(
        updatedDepartments.filter(
          (d) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.organization.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        ),
      );

      toast("Department deleted successfully", {
        description: "The department has been removed from the system.",
      });
    } catch (error) {
      toast("Failed to delete department", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsDeleting(false);
      setDeletingDepartment(null);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter(
        (department) =>
          department.name.toLowerCase().includes(query.toLowerCase()) ||
          department.organization.name
            .toLowerCase()
            .includes(query.toLowerCase()),
      );
      setFilteredDepartments(filtered);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [refreshTrigger]);

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>Manage academic departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                Manage academic departments. You have {departments.length}{" "}
                department{departments.length !== 1 ? "s" : ""}.
                {searchQuery &&
                  ` Showing ${filteredDepartments.length} filtered result${filteredDepartments.length !== 1 ? "s" : ""}.`}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {filteredDepartments.length} Departments
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredDepartments.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No departments found matching your search."
                  : "No departments found."}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Create your first department to get started."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Teachers</TableHead>
                    <TableHead>Batches</TableHead>
                    <TableHead>FYP Groups</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDepartments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{department.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3" />
                            ID: {department.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {department.organization.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-blue-500" />
                          <span className="font-medium">
                            {department.studentsCount || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3 text-green-500" />
                          <span className="font-medium">
                            {department.teachersCount || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-purple-500" />
                          <span className="font-medium">
                            {department.batchesCount || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-orange-500" />
                          <span className="font-medium">
                            {department.fypGroupsCount || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(department.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => setEditingDepartment(department)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeletingDepartment(department)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingDepartment && (
        <EditDepartment
          department={editingDepartment}
          open={!!editingDepartment}
          onOpenChange={(open) => !open && setEditingDepartment(null)}
          onDepartmentUpdated={() => {
            fetchDepartments();
            setEditingDepartment(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingDepartment}
        onOpenChange={(open) => !open && setDeletingDepartment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              department "{deletingDepartment?.name}" and remove all associated
              data including students, teachers, batches, and FYP groups.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingDepartment && handleDelete(deletingDepartment)
              }
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Department
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
