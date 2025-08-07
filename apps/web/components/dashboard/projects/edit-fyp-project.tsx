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

export function EditFYPProject({
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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      console.log("Updating FYP project:", values);

      toast("FYP project updated successfully", {
        description: "The changes have been saved.",
      });

      onOpenChange(false);
      onProjectUpdated?.();
    } catch (error) {
      toast("Failed to update FYP project", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit FYP Project</DialogTitle>
          <DialogDescription>
            Make changes to the FYP project. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter project title"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear and descriptive title for the FYP project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter project description"
                      className="min-h-[120px]"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed description of the project objectives, scope, and
                    expected outcomes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
