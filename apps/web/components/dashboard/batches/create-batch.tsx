"use client";

import { useState } from "react";
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
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  createBatchSchema,
  type CreateBatchInput,
  type DepartmentEntity,
} from "@/types/types";

interface CreateBatchProps {
  onBatchCreated: () => void;
}

// Mock departments data - replace with actual API call
const mockDepartments: DepartmentEntity[] = [
  {
    id: 1,
    name: "Computer Science",
    organizationId: 1,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    organization: {
      id: 1,
      name: "Tech University",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: 2,
    name: "Software Engineering",
    organizationId: 1,
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
    organization: {
      id: 1,
      name: "Tech University",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    id: 3,
    name: "Electrical Engineering",
    organizationId: 1,
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
    organization: {
      id: 1,
      name: "Tech University",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

export function CreateBatch({ onBatchCreated }: CreateBatchProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateBatchInput>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: {
      name: "",
      batchYear: new Date().getFullYear(),
      batchCode: "",
      departmentId: 0,
    },
  });

  const onSubmit = async (data: CreateBatchInput) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Creating batch:", data);

      toast("Batch created successfully", {
        description: `${data.name} (${data.batchCode}) has been created for ${data.batchYear}`,
      });

      form.reset();
      setOpen(false);
      onBatchCreated();
    } catch (error) {
      toast("Error creating batch", {
        description:
          "There was a problem creating the batch. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateBatchCode = () => {
    const selectedDepartmentId = form.getValues("departmentId");
    const batchYear = form.getValues("batchYear");

    if (selectedDepartmentId && batchYear) {
      const department = mockDepartments.find(
        (d) => d.id === selectedDepartmentId,
      );
      if (department) {
        const deptCode = department.name
          .split(" ")
          .map((word) => word[0])
          .join("")
          .toUpperCase();
        const yearCode = batchYear.toString().slice(-2);
        const generatedCode = `${deptCode}-${yearCode}`;
        form.setValue("batchCode", generatedCode);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Batch</DialogTitle>
          <DialogDescription>
            Create a new batch and assign it to a department. Students can be
            assigned to this batch later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fall 2024 Batch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="batchYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2024"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value));
                          setTimeout(generateBatchCode, 100);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="batchCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Code</FormLabel>
                    <FormControl>
                      <Input placeholder="CS-24" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(parseInt(value));
                      setTimeout(generateBatchCode, 100);
                    }}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockDepartments.map((department) => (
                        <SelectItem
                          key={department.id}
                          value={department.id.toString()}
                        >
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Batch
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
