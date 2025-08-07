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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  Copy,
  Clock,
  Users,
} from "lucide-react";
import { format, isAfter } from "date-fns";
import type { JoinCode, Role } from "@/types/types";
import { getRoleDisplayName, getRoleColor } from "@/types/types";
import { EditJoinCode } from "./edit-join-code";
import { deleteJoinCode, getOrganizationJoinCodes } from "@/lib/api/joincode";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { se } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface ListJoinCodesProps {
  refreshTrigger?: number;
}

export function ListJoinCodes({ refreshTrigger }: ListJoinCodesProps) {
  const [joinCodes, setJoinCodes] = useState<JoinCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedOrganization = useSelector(
    (state: RootState) => state.organizations.selectedOrganization,
  );
  const router = useRouter();
  const [editingJoinCode, setEditingJoinCode] = useState<JoinCode | null>(null);
  const [deletingJoinCode, setDeletingJoinCode] = useState<JoinCode | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockJoinCodes: JoinCode[] = [
    {
      id: 1,
      code: "ADMIN123",
      organizationId: 1,
      role: "ADMIN" as Role,
      usageLimit: 5,
      usedCount: 2,
      expiresAt: new Date("2024-12-31"),
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
      organization: {
        id: 1,
        name: "University of Technology",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
    },
    {
      id: 2,
      code: "TEACH456",
      organizationId: 2,
      role: "TEACHER" as Role,
      usageLimit: null,
      usedCount: 8,
      expiresAt: null,
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-02-01"),
      organization: {
        id: 2,
        name: "State College of Engineering",
        createdAt: new Date("2024-01-20"),
        updatedAt: new Date("2024-02-01"),
      },
    },
    {
      id: 3,
      code: "STUD789",
      organizationId: 3,
      role: "STUDENT" as Role,
      usageLimit: 100,
      usedCount: 45,
      expiresAt: new Date("2024-06-30"),
      createdAt: new Date("2024-02-05"),
      updatedAt: new Date("2024-02-05"),
      organization: {
        id: 3,
        name: "Metropolitan University",
        createdAt: new Date("2024-02-05"),
        updatedAt: new Date("2024-02-05"),
      },
    },
  ];
  useEffect(() => {
    // Simulate fetching join codes from an API
    if (selectedOrganization) {
      fetchJoinCodes();
    }
  }, [refreshTrigger, selectedOrganization]);
  const fetchJoinCodes = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      const joinCodesResponse = await getOrganizationJoinCodes(
        String(selectedOrganization?.id || 0),
      );
      console.log("***Fetched join codes:", joinCodesResponse);
      // Here you would make the actual API call
      setJoinCodes(joinCodesResponse);
    } catch (error) {
      toast("Failed to fetch join codes", {
        description: "Unable to load join codes. Please refresh the page.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (joinCode: JoinCode) => {
    setIsDeleting(true);
    try {
      // Simulate API call
      const deletedCode = await deleteJoinCode(String(joinCode.id));

      // Here you would make the actual API call
      console.log("Deleting join code:", joinCode.id);

      setJoinCodes((prev) => prev.filter((code) => code.id !== joinCode.id));
      // toast({
      //   title: "Success",
      //   description: "Join code deleted successfully.",
      // });
      // toast("Event has been created", {
      //   description: "Sunday, December 03, 2023 at 9:00 AM",
      //   action: {
      //     label: "Undo",
      //     onClick: () => console.log("Undo"),
      //   },
      // });
      // router.refresh();
      toast("Join code deleted successfully", {
        description: "The join code has been removed from the system.",
      });
    } catch (error) {
      toast("Failed to delete join code", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsDeleting(false);
      setDeletingJoinCode(null);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast("Join code copied to clipboard", {
        description: "You can now share this code with users.",
      });
    } catch (error) {
      toast("Failed to copy join code", {
        description: "Please try copying the code manually.",
      });
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  const isExpired = (expiresAt: Date | null) => {
    if (!expiresAt) return false;
    return isAfter(new Date(), expiresAt);
  };

  const isUsageLimitReached = (
    usageLimit: number | null,
    usedCount: number,
  ) => {
    if (!usageLimit) return false;
    return usedCount >= usageLimit;
  };

  const getUsageProgress = (usageLimit: number | null, usedCount: number) => {
    if (!usageLimit) return 0;
    return (usedCount / usageLimit) * 100;
  };

  const getStatusBadge = (joinCode: JoinCode) => {
    if (isExpired(joinCode.expiresAt)) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (isUsageLimitReached(joinCode.usageLimit, joinCode.usedCount)) {
      return <Badge variant="destructive">Limit Reached</Badge>;
    }
    return <Badge variant="secondary">Active</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Join Codes</CardTitle>
          <CardDescription>
            Manage join codes for user registration
          </CardDescription>
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
          <CardTitle>Join Codes</CardTitle>
          <CardDescription>
            Manage join codes for user registration. You have {joinCodes.length}{" "}
            join code
            {joinCodes.length !== 1 ? "s" : ""}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {joinCodes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No join codes found.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first join code to get started.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {joinCodes.map((joinCode) => (
                    <TableRow key={joinCode.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                            {joinCode.code}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyCode(joinCode.code)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {joinCode.organization.name}
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(joinCode.role)}>
                          {getRoleDisplayName(joinCode.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-3 w-3" />
                            {joinCode.usedCount}
                            {joinCode.usageLimit && ` / ${joinCode.usageLimit}`}
                          </div>
                          {joinCode.usageLimit && (
                            <Progress
                              value={getUsageProgress(
                                joinCode.usageLimit,
                                joinCode.usedCount,
                              )}
                              className="h-1"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(joinCode)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {joinCode.expiresAt ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(joinCode.expiresAt)}
                          </div>
                        ) : (
                          "Never"
                        )}
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
                              onClick={() => handleCopyCode(joinCode.code)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Code
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setEditingJoinCode(joinCode)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingJoinCode(joinCode)}
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
      {editingJoinCode && (
        <EditJoinCode
          joinCode={editingJoinCode}
          open={!!editingJoinCode}
          onOpenChange={(open) => !open && setEditingJoinCode(null)}
          onJoinCodeUpdated={() => {
            fetchJoinCodes();
            setEditingJoinCode(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingJoinCode}
        onOpenChange={(open) => !open && setDeletingJoinCode(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              join code "{deletingJoinCode?.code}" and prevent any future
              registrations using this code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingJoinCode && handleDelete(deletingJoinCode)}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Join Code
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
