"use client";

import { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Users,
  BookOpen,
  Trophy,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { EditBatch } from "./edit-batch";
import type { BatchEntity } from "@/types/types";

interface ListBatchesProps {
  refreshTrigger: number;
}

// Mock batches data - replace with actual API call
const mockBatches: BatchEntity[] = [
  {
    id: 1,
    name: "Fall 2024 Computer Science",
    batchYear: 2024,
    batchCode: "CS-24",
    departmentId: 1,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    department: {
      id: 1,
      name: "Computer Science",
      organizationId: 1,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      organization: {
        id: 1,
        name: "Tech University",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    studentsCount: 45,
    gradingSchemesCount: 3,
    fypGroupsCount: 8,
  },
  {
    id: 2,
    name: "Spring 2024 Software Engineering",
    batchYear: 2024,
    batchCode: "SE-24",
    departmentId: 2,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
    department: {
      id: 2,
      name: "Software Engineering",
      organizationId: 1,
      createdAt: new Date("2024-01-16"),
      updatedAt: new Date("2024-01-16"),
      organization: {
        id: 1,
        name: "Tech University",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    studentsCount: 38,
    gradingSchemesCount: 2,
    fypGroupsCount: 6,
  },
  {
    id: 3,
    name: "Fall 2023 Electrical Engineering",
    batchYear: 2023,
    batchCode: "EE-23",
    departmentId: 3,
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2023-08-15"),
    department: {
      id: 3,
      name: "Electrical Engineering",
      organizationId: 1,
      createdAt: new Date("2024-01-17"),
      updatedAt: new Date("2024-01-17"),
      organization: {
        id: 1,
        name: "Tech University",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    studentsCount: 52,
    gradingSchemesCount: 4,
    fypGroupsCount: 10,
  },
];

export function ListBatches({ refreshTrigger }: ListBatchesProps) {
  const [batches] = useState<BatchEntity[]>(mockBatches);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBatch, setEditingBatch] = useState<BatchEntity | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const filteredBatches = batches.filter(
    (batch) =>
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.department.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEdit = (batch: BatchEntity) => {
    setEditingBatch(batch);
    setEditDialogOpen(true);
  };

  const handleDelete = async (batch: BatchEntity) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast("Batch deleted successfully", {
        description: `${batch.name} has been removed from the system`,
      });
    } catch (error) {
      toast("Error deleting batch", {
        description:
          "There was a problem deleting the batch. Please try again.",
      });
    }
  };

  const totalStudents = batches.reduce(
    (sum, batch) => sum + (batch.studentsCount || 0),
    0,
  );
  const totalGradingSchemes = batches.reduce(
    (sum, batch) => sum + (batch.gradingSchemesCount || 0),
    0,
  );
  const totalFYPGroups = batches.reduce(
    (sum, batch) => sum + (batch.fypGroupsCount || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.length}</div>
            <p className="text-xs text-muted-foreground">
              Active batches across all departments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Students enrolled in all batches
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Grading Schemes
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGradingSchemes}</div>
            <p className="text-xs text-muted-foreground">
              Active grading schemes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FYP Groups</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFYPGroups}</div>
            <p className="text-xs text-muted-foreground">
              Final year project groups
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search batches by name, code, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Batches</CardTitle>
          <CardDescription>
            Manage batches and their department assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Grading Schemes</TableHead>
                <TableHead>FYP Groups</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchTerm
                        ? "No batches found matching your search."
                        : "No batches found."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{batch.batchCode}</Badge>
                    </TableCell>
                    <TableCell>{batch.batchYear}</TableCell>
                    <TableCell>{batch.department.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-blue-500" />
                        <span className="text-sm">
                          {batch.studentsCount || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3 text-green-500" />
                        <span className="text-sm">
                          {batch.gradingSchemesCount || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-purple-500" />
                        <span className="text-sm">
                          {batch.fypGroupsCount || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {batch.createdAt.toLocaleDateString()}
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
                          <DropdownMenuItem onClick={() => handleEdit(batch)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(batch)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

      {/* Edit Dialog */}
      <EditBatch
        batch={editingBatch}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onBatchUpdated={() => {
          // Refresh the list
          console.log("Batch updated, refreshing list...");
        }}
      />
    </div>
  );
}
