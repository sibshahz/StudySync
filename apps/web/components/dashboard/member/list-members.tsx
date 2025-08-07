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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  Search,
  Users,
  Mail,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import type { Member } from "@/types/types";
import {
  getRoleDisplayName,
  getRoleColor,
  getStatusDisplayName,
  getStatusColor,
  getDepartmentDisplayName,
  getBatchDisplayName,
} from "@/types/types";
import { EditMember } from "./edit-member";
import { PromoteMembers } from "./promote-members";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role, Status, Department, Batch } from "@/types/types"; // Import missing types

interface ListMembersProps {
  refreshTrigger?: number;
}

export function ListMembers({ refreshTrigger }: ListMembersProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const { toast } = useToast();

  const [filterRole, setFilterRole] = useState<Role | "ALL">("ALL");
  const [filterDepartment, setFilterDepartment] = useState<Department | "ALL">(
    "ALL",
  );
  const [filterBatch, setFilterBatch] = useState<Batch | "ALL">("ALL");
  const [filterStatus, setFilterStatus] = useState<Status | "ALL">("ALL");

  // Mock data based on the provided schema
  const mockMembers: Member[] = [
    {
      id: 1,
      email: "shahid5ssg@gmail.com",
      name: "syed shahid",
      createdAt: "2025-08-03T12:02:37.148Z",
      updatedAt: "2025-08-03T12:02:37.148Z",
      status: "ACTIVE" as Status,
      roles: ["ADMIN" as Role],
    },
    {
      id: 4,
      email: "student@gmail.com",
      name: "Student",
      createdAt: "2025-08-03T15:39:37.600Z",
      updatedAt: "2025-08-03T15:39:37.600Z",
      status: "ACTIVE" as Status,
      roles: ["STUDENT" as Role],
      department: "COMPUTER_SCIENCE" as Department,
      batch: "SEMESTER_3" as Batch,
    },
    {
      id: 5,
      email: "teacher@gmail.com",
      name: "Dr. Sarah Johnson",
      createdAt: "2025-08-02T10:30:00.000Z",
      updatedAt: "2025-08-02T10:30:00.000Z",
      status: "ACTIVE" as Status,
      roles: ["TEACHER" as Role],
      department: "COMPUTER_SCIENCE" as Department,
    },
    {
      id: 6,
      email: "student2@gmail.com",
      name: "John Doe",
      createdAt: "2025-08-01T14:20:00.000Z",
      updatedAt: "2025-08-01T14:20:00.000Z",
      status: "ACTIVE" as Status,
      roles: ["STUDENT" as Role],
      department: "SOFTWARE_ENGINEERING" as Department,
      batch: "SEMESTER_5" as Batch,
    },
    {
      id: 7,
      email: "staff@gmail.com",
      name: "Michael Chen",
      createdAt: "2025-07-30T09:15:00.000Z",
      updatedAt: "2025-07-30T09:15:00.000Z",
      status: "ACTIVE" as Status,
      roles: ["STAFF" as Role],
    },
  ];

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      setMembers(mockMembers);
      setFilteredMembers(mockMembers);
    } catch (error) {
      toast("Failed to fetch members", {
        description: "Unable to load members. Please refresh the page.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (member: Member) => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      console.log("Deleting member:", member.id);

      const updatedMembers = members.filter((m) => m.id !== member.id);
      setMembers(updatedMembers);
      setFilteredMembers(
        updatedMembers.filter(
          (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );

      // Remove from selected if it was selected
      setSelectedMembers((prev) => prev.filter((id) => id !== member.id));

      toast("Member deleted successfully", {
        description: "The member has been removed from the system.",
      });
    } catch (error) {
      toast("Failed to delete member", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsDeleting(false);
      setDeletingMember(null);
    }
  };

  const applyFilters = () => {
    let filtered = members;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.roles.some((role) =>
            getRoleDisplayName(role)
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply role filter
    if (filterRole !== "ALL") {
      filtered = filtered.filter((member) => member.roles.includes(filterRole));
    }

    // Apply department filter
    if (filterDepartment !== "ALL") {
      filtered = filtered.filter(
        (member) => member.department === filterDepartment,
      );
    }

    // Apply batch filter
    if (filterBatch !== "ALL") {
      filtered = filtered.filter((member) => member.batch === filterBatch);
    }

    // Apply status filter
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((member) => member.status === filterStatus);
    }

    setFilteredMembers(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilterRole("ALL");
    setFilterDepartment("ALL");
    setFilterBatch("ALL");
    setFilterStatus("ALL");
  };

  const handleSelectMember = (memberId: number, checked: boolean) => {
    if (checked) {
      setSelectedMembers((prev) => [...prev, memberId]);
    } else {
      setSelectedMembers((prev) => prev.filter((id) => id !== memberId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(filteredMembers.map((member) => member.id));
    } else {
      setSelectedMembers([]);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [refreshTrigger]);

  useEffect(() => {
    applyFilters();
  }, [
    members,
    searchQuery,
    filterRole,
    filterDepartment,
    filterBatch,
    filterStatus,
  ]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const selectedMemberObjects = members.filter((member) =>
    selectedMembers.includes(member.id),
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organization Members</CardTitle>
          <CardDescription>Manage members in your organization</CardDescription>
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
              <CardTitle>Organization Members</CardTitle>
              <CardDescription>
                Manage members in your organization. You have {members.length}{" "}
                member{members.length !== 1 ? "s" : ""}.
                {(searchQuery ||
                  filterRole !== "ALL" ||
                  filterDepartment !== "ALL" ||
                  filterBatch !== "ALL" ||
                  filterStatus !== "ALL") &&
                  ` Showing ${filteredMembers.length} filtered result${filteredMembers.length !== 1 ? "s" : ""}.`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="ml-auto">
                {filteredMembers.length} Members
              </Badge>
              {selectedMembers.length > 0 && (
                <PromoteMembers
                  selectedMembers={selectedMemberObjects}
                  onPromotionComplete={() => {
                    fetchMembers();
                    setSelectedMembers([]);
                  }}
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              {selectedMembers.length > 0 && (
                <Badge variant="outline">
                  {selectedMembers.length} selected
                </Badge>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Role Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Role:
                </label>
                <Select
                  value={filterRole}
                  onValueChange={(value) =>
                    setFilterRole(value as Role | "ALL")
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles</SelectItem>
                    {Object.values(Role).map((role) => (
                      <SelectItem key={role} value={role}>
                        {getRoleDisplayName(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Department:
                </label>
                <Select
                  value={filterDepartment}
                  onValueChange={(value) =>
                    setFilterDepartment(value as Department | "ALL")
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Departments</SelectItem>
                    {Object.values(Department).map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {getDepartmentDisplayName(dept)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Batch Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Batch:
                </label>
                <Select
                  value={filterBatch}
                  onValueChange={(value) =>
                    setFilterBatch(value as Batch | "ALL")
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Batches</SelectItem>
                    {Object.values(Batch).map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        {getBatchDisplayName(batch)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Status:
                </label>
                <Select
                  value={filterStatus}
                  onValueChange={(value) =>
                    setFilterStatus(value as Status | "ALL")
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    {Object.values(Status).map((status) => (
                      <SelectItem key={status} value={status}>
                        {getStatusDisplayName(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {(searchQuery ||
                filterRole !== "ALL" ||
                filterDepartment !== "ALL" ||
                filterBatch !== "ALL" ||
                filterStatus !== "ALL") && (
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Active Filters Display */}
            {(filterRole !== "ALL" ||
              filterDepartment !== "ALL" ||
              filterBatch !== "ALL" ||
              filterStatus !== "ALL") && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {filterRole !== "ALL" && (
                  <Badge variant="secondary" className="gap-1">
                    Role: {getRoleDisplayName(filterRole)}
                    <button
                      onClick={() => setFilterRole("ALL")}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filterDepartment !== "ALL" && (
                  <Badge variant="secondary" className="gap-1">
                    Dept: {getDepartmentDisplayName(filterDepartment)}
                    <button
                      onClick={() => setFilterDepartment("ALL")}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filterBatch !== "ALL" && (
                  <Badge variant="secondary" className="gap-1">
                    Batch: {getBatchDisplayName(filterBatch)}
                    <button
                      onClick={() => setFilterBatch("ALL")}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {filterStatus !== "ALL" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {getStatusDisplayName(filterStatus)}
                    <button
                      onClick={() => setFilterStatus("ALL")}
                      className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>

          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No members found matching your search."
                  : "No members found."}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Add your first member to get started."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          filteredMembers.length > 0 &&
                          selectedMembers.length === filteredMembers.length
                        }
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={(checked) =>
                            handleSelectMember(member.id, !!checked)
                          }
                          aria-label={`Select ${member.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{member.name}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {member.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.roles.map((role) => (
                            <Badge key={role} className={getRoleColor(role)}>
                              {getRoleDisplayName(role)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(member.status)}>
                          {getStatusDisplayName(member.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.department ? (
                          <span className="text-sm">
                            {getDepartmentDisplayName(member.department)}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {member.batch ? (
                          <span className="text-sm">
                            {getBatchDisplayName(member.batch)}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(member.createdAt)}
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
                              onClick={() => setEditingMember(member)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeletingMember(member)}
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
      {editingMember && (
        <EditMember
          member={editingMember}
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
          onMemberUpdated={() => {
            fetchMembers();
            setEditingMember(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingMember}
        onOpenChange={(open) => !open && setDeletingMember(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              member "{deletingMember?.name}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingMember && handleDelete(deletingMember)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
