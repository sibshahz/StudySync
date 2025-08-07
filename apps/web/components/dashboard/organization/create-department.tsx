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
  DialogTrigger,
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
import { Plus, Loader2 } from "lucide-react";
import {
  createDepartmentSchema,
  type CreateDepartmentInput,
  type Organization,
} from "@/types/types";

interface CreateDepartmentProps {
  onDepartmentCreated?: () => void;
}

export function CreateDepartment({
  onDepartmentCreated,
}: CreateDepartmentProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const { toast } = useToast();

  const form = useForm<CreateDepartmentInput>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {
      name: "",
      organizationId: undefined,
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

  async function onSubmit(values: CreateDepartmentInput) {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      console.log("Creating department:", values);

      toast("Department created successfully", {
        description: "The department has been added to the organization.",
      });

      form.reset();
      setOpen(false);
      onDepartmentCreated?.();
    } catch (error) {
      toast("Failed to create department", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Department</DialogTitle>
          <DialogDescription>
            Add a new department to the organization.
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
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Department
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
