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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  editFYPProjectSchema,
  type EditFYPProjectInput,
  type FYPProject,
} from "@/types/types";

interface EditFYPProjectProps {
  project: FYPProject;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectUpdated?: () => void;
}

export function ViewFYPProject({
  project,
  open,
  onOpenChange,
  onProjectUpdated,
}: EditFYPProjectProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<EditFYPProjectInput>({
    resolver: zodResolver(editFYPProjectSchema),
    defaultValues: {
      id: project.id,
      title: project.title,
      description: project.description,
    },
  });

  // Reset form when project changes
  useEffect(() => {
    form.reset({
      id: project.id,
      title: project.title,
      description: project.description,
    });
  }, [project, form]);

  async function onSubmit(values: EditFYPProjectInput) {
    setIsLoading(true);
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      console.log("Updating FYP project:", values);

      // toast({
      //   title: "Success",
      //   description: "FYP project updated successfully.",
      // });

      onOpenChange(false);
      onProjectUpdated?.();
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Failed to update FYP project. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Project Name: {project.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="max-h-96 overflow-y-auto font-medium text-sm text-justify leading-loose pr-4 text-muted-foreground">
          <span className="font-bold text-lg">Project Description: </span>
          {project.description || "No description provided."}
        </DialogDescription>
        <DialogFooter>
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
