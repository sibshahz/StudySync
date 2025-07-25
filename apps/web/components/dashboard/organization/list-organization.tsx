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
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import type { Organization } from "@/types/types";
import { EditOrganization } from "./edit-organization";
import { getAllOrganizations } from "@/lib/api/organization";

interface ListOrganizationsProps {
  refreshTrigger?: number;
}

export function ListOrganizations({ refreshTrigger }: ListOrganizationsProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const [deletingOrganization, setDeletingOrganization] =
    useState<Organization | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockOrganizations: Organization[] = [
    {
      id: 1,
      name: "University of Technology",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    },
    {
      id: 2,
      name: "State College of Engineering",
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-02-01"),
    },
    {
      id: 3,
      name: "Metropolitan University",
      createdAt: new Date("2024-02-05"),
      updatedAt: new Date("2024-02-05"),
    },
  ];

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await getAllOrganizations();
      console.log("***Fetched organizations:", response.data);
      // Here you would make the actual API call
      setOrganizations(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch organizations?.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (organization: Organization) => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      console.log("Deleting organization:", organization.id);

      setOrganizations((prev) =>
        prev.filter((org) => org.id !== organization.id),
      );

      toast({
        title: "Success",
        description: "Organization deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete organization.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletingOrganization(null);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [refreshTrigger]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // convert string to Date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // optional: display 12-hour format with AM/PM
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>Manage your organizations</CardDescription>
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
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            Manage your organizations. You have {organizations?.length}{" "}
            organization
            {organizations?.length !== 1 ? "s" : ""}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {organizations?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No organizations found.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Create your first organization to get started.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations?.map((organization) => (
                    <TableRow key={organization.id}>
                      <TableCell className="font-medium">
                        {organization.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Active</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(organization.createdAt)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(organization.updatedAt)}
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
                              onClick={() =>
                                setEditingOrganization(organization)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                setDeletingOrganization(organization)
                              }
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
      {editingOrganization && (
        <EditOrganization
          organization={editingOrganization}
          open={!!editingOrganization}
          onOpenChange={(open) => !open && setEditingOrganization(null)}
          onOrganizationUpdated={() => {
            fetchOrganizations();
            setEditingOrganization(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingOrganization}
        onOpenChange={(open) => !open && setDeletingOrganization(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              organization "{deletingOrganization?.name}" and remove all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingOrganization && handleDelete(deletingOrganization)
              }
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Organization
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
