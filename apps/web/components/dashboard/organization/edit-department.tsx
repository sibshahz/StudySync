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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  editDepartmentSchema,
  type EditDepartmentInput,
  type DepartmentEntity,
  type Organization,
} from "@/types/types";

interface EditDepartmentProps {
  department: DepartmentEntity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDepartmentUpdated?: () => void;
}

export function EditDepartment({
  department,
  open,
  onOpenChange,
  onDepartmentUpdated,
}: EditDepartmentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { toast } = useToast();

  const form = useForm<EditDepartmentInput>({
    resolver: zodResolver(editDepartmentSchema),
    defaultValues: {
      id: department.id,
      name: department.name,
      organizationId: department.organizationId,
    },
  });

  // Mock organizations data
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

  useEffect(() => {
    // Fetch organizations
    setOrganizations(mockOrganizations);
  }, []);

  // Reset form when department changes
  useEffect(() => {
    form.reset({
      id: department.id,
      name: department.name,
      organizationId: department.organizationId,
    });
  }, [department, form]);

  async function onSubmit(values: EditDepartmentInput) {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      console.log("Updating department:", values);

      toast("Department updated successfully", {
        description: "The changes have been saved.",
      });

      onOpenChange(false);
      onDepartmentUpdated?.();
    } catch (error) {
      toast("Failed to update department", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Make changes to the department. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter department name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of the academic department.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(Number.parseInt(value))
                    }
                    value={field.value?.toString()}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id.toString()}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The organization this department belongs to.
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
