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
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  Search,
  Eye,
  Calendar,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import type { FYPProject } from "@/types/types";
import { EditFYPProject } from "@/components/dashboard/projects/edit-fyp-project";
import { getAllProjects } from "@/lib/api/project";
import { ViewFYPProject } from "./view-fyp-project";
import { useAuth } from "@/contexts/auth-context";

interface ListFYPProjectsProps {
  refreshTrigger?: number;
}

export function ListFYPProjects({ refreshTrigger }: ListFYPProjectsProps) {
  const [projects, setProjects] = useState<FYPProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<FYPProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<FYPProject | null>(null);
  const [viewProject, setViewProject] = useState<FYPProject | null>(null);
  const [deletingProject, setDeletingProject] = useState<FYPProject | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const { toast } = useToast();

  // Mock data for demonstration
  const mockProjects: FYPProject[] = [
    {
      id: 1,
      title: "AI-Powered Student Performance Analytics System",
      description:
        "A comprehensive system that uses machine learning algorithms to analyze student performance patterns, predict academic outcomes, and provide personalized recommendations for improvement. The system will integrate with existing LMS platforms and provide real-time insights to educators.",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-02-01"),
    },
    {
      id: 2,
      title: "Blockchain-Based Academic Credential Verification",
      description:
        "A decentralized platform for issuing, storing, and verifying academic credentials using blockchain technology. This system ensures tamper-proof certificates and enables instant verification by employers and institutions worldwide.",
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-01-25"),
    },
    {
      id: 3,
      title: "Virtual Reality Campus Tour Application",
      description:
        "An immersive VR application that allows prospective students to take virtual tours of university campuses. Features include interactive hotspots, 360-degree views, and integration with admission systems for scheduling real visits.",
      createdAt: new Date("2024-02-05"),
      updatedAt: new Date("2024-02-10"),
    },
    {
      id: 4,
      title: "Smart Library Management with IoT Integration",
      description:
        "An intelligent library management system that uses IoT sensors to track book locations, monitor occupancy, and automate inventory management. Includes mobile app for students to locate books and reserve study spaces.",
      createdAt: new Date("2024-02-12"),
      updatedAt: new Date("2024-02-15"),
    },
    {
      id: 5,
      title: "Automated Code Review and Plagiarism Detection",
      description:
        "A system that automatically reviews student code submissions, detects plagiarism, provides feedback on code quality, and suggests improvements. Uses advanced algorithms to compare code structure and logic patterns.",
      createdAt: new Date("2024-02-18"),
      updatedAt: new Date("2024-02-20"),
    },
  ];

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await getAllProjects();
      console.log("*** Fetched projects:", response);

      // Here you would make the actual API call
      setProjects(response);
      setFilteredProjects(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch FYP projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (project: FYPProject) => {
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      console.log("Deleting FYP project:", project.id);

      const updatedProjects = projects.filter((p) => p.id !== project.id);
      setProjects(updatedProjects);
      setFilteredProjects(
        updatedProjects.filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );

      // toast({
      //   title: "Success",
      //   description: "FYP project deleted successfully.",
      // });
      toast("FYP project deleted", {
        description: `Project "${project.title}" has been deleted.`,
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      });
    } catch (error) {
      toast("Error deleting project", {
        description: "Failed to delete FYP project.",
        style: { color: "red" },
      });
    } finally {
      setIsDeleting(false);
      setDeletingProject(null);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(query.toLowerCase()) ||
          project.description.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredProjects(filtered);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [refreshTrigger]);

  const formatDate = (date: Date) => {
    return format(date, "MMM dd, yyyy");
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>FYP Projects</CardTitle>
          <CardDescription>Manage Final Year Projects</CardDescription>
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
              <CardTitle>FYP Projects</CardTitle>
              <CardDescription>
                Manage Final Year Projects. You have {projects.length} project
                {projects.length !== 1 ? "s" : ""}.
                {searchQuery &&
                  ` Showing ${filteredProjects.length} filtered result${filteredProjects.length !== 1 ? "s" : ""}.`}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {filteredProjects.length} Projects
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery
                  ? "No projects found matching your search."
                  : "No FYP projects found."}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Create your first project to get started."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[120px]">Created</TableHead>
                    <TableHead className="w-[120px]">Updated</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium leading-tight">
                            {project.title}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            ID: {project.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {truncateText(project.description, 120)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(project.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(project.updatedAt)}
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
                              onClick={() => {
                                setViewProject(project);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setEditingProject(project)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingProject(project)}
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
      {editingProject && (
        <EditFYPProject
          project={editingProject}
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
          onProjectUpdated={() => {
            fetchProjects();
            setEditingProject(null);
          }}
        />
      )}

      {/* Edit Dialog */}
      {viewProject && (
        <ViewFYPProject
          project={viewProject}
          open={!!viewProject}
          onOpenChange={(open) => !open && setViewProject(null)}
          onProjectUpdated={() => {
            fetchProjects();
            setViewProject(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingProject}
        onOpenChange={(open) => !open && setDeletingProject(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the FYP
              project "{deletingProject?.title}" and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingProject && handleDelete(deletingProject)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
