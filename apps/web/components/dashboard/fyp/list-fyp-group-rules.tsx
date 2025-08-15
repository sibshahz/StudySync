"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  Settings,
  FlaskConical,
  Calendar,
  Loader2,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { toast } from "sonner";
import { EditFYPGroupRules } from "./edit-fyp-group-rules";
import type { FYPGroupRules } from "@/types/types";
import {
  getAllFYPGroupRules,
  deleteFYPGroupRules,
} from "@/lib/api/fypGroupRules";
import type { RootState } from "@/lib/store/store";

interface ListFYPGroupRulesProps {
  refreshTrigger: number;
}

export function ListFYPGroupRules({ refreshTrigger }: ListFYPGroupRulesProps) {
  const [groupRules, setGroupRules] = useState<FYPGroupRules[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGroupRules, setEditingGroupRules] =
    useState<FYPGroupRules | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Get selected organization from Redux store
  const selectedOrganization = useSelector(
    (state: RootState) => state.organizations.selectedOrganization,
  );

  // Fetch group rules when component mounts, refreshTrigger changes, or organization changes
  useEffect(() => {
    const fetchGroupRules = async () => {
      if (!selectedOrganization?.id) {
        setGroupRules([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const fetchedGroupRules = await getAllFYPGroupRules(
          selectedOrganization.id.toString(),
        );
        const newRules = fetchedGroupRules.filter((rule) => rule.id);
        console.log("*** Filtered FYP group rules:", newRules);
        setGroupRules(fetchedGroupRules || []);
      } catch (error) {
        console.error("Error fetching FYP group rules:", error);
        toast("Error loading FYP group rules", {
          description: "Could not load FYP group rules. Please try again.",
        });
        setGroupRules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupRules();
  }, [refreshTrigger, selectedOrganization?.id]);

  const filteredGroupRules = groupRules.filter(
    (rule) =>
      rule.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.minMembers.toString().includes(searchTerm) ||
      rule.maxMembers.toString().includes(searchTerm),
  );

  const handleEdit = (groupRule: FYPGroupRules) => {
    setEditingGroupRules(groupRule);
    setEditDialogOpen(true);
  };

  const handleDelete = async (groupRule: FYPGroupRules) => {
    if (!selectedOrganization?.id) {
      toast("Error", {
        description: "Please select an organization first.",
      });
      return;
    }

    try {
      await deleteFYPGroupRules(groupRule.batchId.toString());

      // Remove the deleted group rule from the local state
      setGroupRules((prevRules) =>
        prevRules.filter((r) => r.id !== groupRule.id),
      );

      toast("FYP group rules deleted successfully", {
        description: `Group rules for ${groupRule.batchName} have been removed`,
      });
    } catch (error: any) {
      toast("Error deleting FYP group rules", {
        description:
          error?.response?.data?.message ||
          "There was a problem deleting the FYP group rules. Please try again.",
      });
    }
  };

  // Calculate statistics
  const totalRules = groupRules.length;
  const averageMinMembers =
    groupRules.length > 0
      ? Math.round(
          (groupRules.reduce((sum, rule) => sum + rule.minMembers, 0) /
            groupRules.length) *
            10,
        ) / 10
      : 0;
  const averageMaxMembers =
    groupRules.length > 0
      ? Math.round(
          (groupRules.reduce((sum, rule) => sum + rule.maxMembers, 0) /
            groupRules.length) *
            10,
        ) / 10
      : 0;
  const uniqueDepartments = new Set(
    groupRules.map((rule) => rule.departmentName),
  ).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading FYP group rules...</p>
        </div>
      </div>
    );
  }

  if (!selectedOrganization) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Calendar className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Please select an organization to view FYP group rules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRules}</div>
            <p className="text-xs text-muted-foreground">
              FYP group rules configured
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Min Members
            </CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMinMembers}</div>
            <p className="text-xs text-muted-foreground">
              Average minimum group size
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Max Members
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMaxMembers}</div>
            <p className="text-xs text-muted-foreground">
              Average maximum group size
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueDepartments}</div>
            <p className="text-xs text-muted-foreground">
              Departments with FYP rules
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by batch name, department, or member limits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Group Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle>FYP Group Rules</CardTitle>
          <CardDescription>
            Manage group rules and member limits for Final Year Projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Min Members</TableHead>
                <TableHead>Max Members</TableHead>
                <TableHead>Range</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroupRules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchTerm
                        ? "No FYP group rules found matching your search."
                        : "No FYP group rules found."}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredGroupRules
                  .filter((rule) => rule.id) // Only keep rules with an id
                  .map((rule) => (
                    <TableRow key={rule.id} className={`special-${rule.id}`}>
                      <TableCell className="font-medium">
                        {rule.batchName || rule.batch?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        {rule.departmentName ||
                          rule.batch?.department?.name ||
                          "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-200"
                        >
                          {rule.minMembers}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-200"
                        >
                          {rule.maxMembers}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-purple-500" />
                          <span className="text-sm">
                            {rule.minMembers}-{rule.maxMembers}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(rule.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(rule.updatedAt).toLocaleDateString()}
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
                            <DropdownMenuItem onClick={() => handleEdit(rule)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(rule)}
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
      <EditFYPGroupRules
        groupRules={editingGroupRules}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onGroupRulesUpdated={() => {
          // Refresh the list by re-fetching data
          const fetchGroupRules = async () => {
            if (selectedOrganization?.id) {
              try {
                const fetchedGroupRules = await getAllFYPGroupRules(
                  selectedOrganization.id.toString(),
                );
                setGroupRules(fetchedGroupRules || []);
              } catch (error) {
                console.error("Error refreshing FYP group rules:", error);
              }
            }
          };
          fetchGroupRules();
        }}
      />
    </div>
  );
}
