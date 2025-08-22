"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  editFYPProjectSchema,
  type EditFYPProjectInput,
  type FYPProject,
} from "@/types/types";
import {
  getProjectSelectionDetails,
  getSelectFYPProject,
} from "@/lib/api/project";
import { set } from "zod";
interface SelectFYPProjectProps {
  project: FYPProject;
  deptId: number;
  batchId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated?: () => void;
}

export function SelectFYPProject({
  project,
  deptId,
  batchId,
  open,
  onOpenChange,
  onProjectUpdated,
}: SelectFYPProjectProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState();
  const { toast } = useToast();

  const form = useForm<EditFYPProjectInput>({
    resolver: zodResolver(editFYPProjectSchema),
    defaultValues: {
      id: project.id,
      title: project.title,
      description: project.description,
    },
  });

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const result = await getProjectSelectionDetails(project.id);
        console.log("***Project details are: ", result);
        setProjectDetails(result);
      } catch (error) {
        console.error("Failed to fetch project details:", error);
      }
    };
    if (project) {
      fetchProjectDetails();
    }
  }, [project]);

  // Reset form when project changes
  useEffect(() => {
    form.reset({
      id: project.id,
      title: project.title,
      description: project.description,
    });
  }, [project, form]);

  async function handleSelectProject(projectId: number) {
    setIsLoading(true);

    try {
      const result = await getSelectFYPProject(projectId);
      toast({
        title: "Success",
        description: "FYP project selected successfully.",
      });
      setProjectDetails(projectDetails.push(result));
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select FYP project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Project Name: {project.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="max-h-96 overflow-y-auto font-medium text-sm text-justify leading-loose pr-4 text-muted-foreground">
          <span className="font-bold text-lg">Group Members: </span>
          {/* {project.description || "No description provided."} */}
          {projectDetails?.length == 0
            ? "No group members yet."
            : projectDetails?.map((student: any, index: number) => {
                return (
                  <Table key={student.id}>
                    <TableBody>
                      <TableRow>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{student.user.name}</TableCell>
                        <TableCell>{student.user.email}</TableCell>
                        <TableCell>{student.batch.name}</TableCell>
                        <TableCell>{student.department.name}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                );
              })}
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => handleSelectProject(project.id)}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Select Project"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
