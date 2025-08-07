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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  editBatchSchema,
  type EditBatchInput,
  type BatchEntity,
  type DepartmentEntity,
} from "@/types/types";

interface EditBatchProps {
  batch: BatchEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBatchUpdated: () => void;
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

export function EditBatch({
  batch,
  open,
  onOpenChange,
  onBatchUpdated,
}: EditBatchProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditBatchInput>({
    resolver: zodResolver(editBatchSchema),
    defaultValues: {
      id: 0,
      name: "",
      batchYear: new Date().getFullYear(),
      batchCode: "",
      departmentId: 0,
    },
  });

  useEffect(() => {
    if (batch) {
      form.reset({
        id: batch.id,
        name: batch.name,
        batchYear: batch.batchYear,
        batchCode: batch.batchCode,
        departmentId: batch.departmentId,
      });
    }
  }, [batch, form]);

  const onSubmit = async (data: EditBatchInput) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Updating batch:", data);

      toast("Batch updated successfully", {
        description: `${data.name} (${data.batchCode}) has been updated`,
      });

      onOpenChange(false);
      onBatchUpdated();
    } catch (error) {
      toast("Error updating batch", {
        description:
          "There was a problem updating the batch. Please try again.",
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Batch</DialogTitle>
          <DialogDescription>
            Update the batch information. Changes will affect all associated
            students.
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
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Batch
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
