"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
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
import { updateBatch } from "@/lib/api/batches";
import { getDepartments } from "@/lib/api/departments";
import type { RootState } from "@/lib/store/store";

interface EditBatchProps {
  batch: BatchEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBatchUpdated: () => void;
}

export function EditBatch({
  batch,
  open,
  onOpenChange,
  onBatchUpdated,
}: EditBatchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<DepartmentEntity[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  
  // Get selected organization from Redux store
  const selectedOrganization = useSelector((state: RootState) => state.organizations.selectedOrganization);

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

  // Fetch departments when component mounts or organization changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!selectedOrganization?.id) {
        setDepartments([]);
        setLoadingDepartments(false);
        return;
      }

      setLoadingDepartments(true);
      try {
        const fetchedDepartments = await getDepartments(selectedOrganization.id.toString());
        setDepartments(fetchedDepartments || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast("Error loading departments", {
          description: "Could not load departments. Please try again.",
        });
        setDepartments([]);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [selectedOrganization?.id]);

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
    if (!selectedOrganization) {
      toast("Error", {
        description: "Please select an organization first.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateBatch(data);

      toast("Batch updated successfully", {
        description: `${data.name} (${data.batchCode}) has been updated`,
      });

      onOpenChange(false);
      onBatchUpdated();
    } catch (error: any) {
      toast("Error updating batch", {
        description: error?.response?.data?.message || "There was a problem updating the batch. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateBatchCode = () => {
    const selectedDepartmentId = form.getValues("departmentId");
    const batchYear = form.getValues("batchYear");

    if (selectedDepartmentId && batchYear) {
      const department = departments.find(
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
                      {loadingDepartments ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2 text-sm">Loading departments...</span>
                        </div>
                      ) : departments.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          {selectedOrganization ? "No departments found" : "Please select an organization first"}
                        </div>
                      ) : (
                        departments.map((department) => (
                          <SelectItem
                            key={department.id}
                            value={department.id.toString()}
                          >
                            {department.name}
                          </SelectItem>
                        ))
                      )}
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
