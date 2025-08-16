"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  assignStudentBatchSchema,
  type AssignStudentBatchInput,
  Batch,
  getBatchDisplayName,
  type Student,
} from "@/types/types";

interface AssignBatchProps {
  students: Student[];
  selectedStudentIds: number[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (data: AssignStudentBatchInput) => Promise<void>;
}

export function AssignBatch({
  students,
  selectedStudentIds,
  open,
  onOpenChange,
  onAssign,
}: AssignBatchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AssignStudentBatchInput>({
    resolver: zodResolver(assignStudentBatchSchema),
    defaultValues: {
      studentIds: selectedStudentIds,
      batch: undefined,
    },
  });

  const selectedStudents = students.filter((student) =>
    selectedStudentIds.includes(student.id),
  );

  const onSubmit = async (data: AssignStudentBatchInput) => {
    try {
      setIsLoading(true);
      await onAssign(data);
      toast({
        title: "Success",
        description: `Successfully assigned ${selectedStudentIds.length} student(s) to ${getBatchDisplayName(data.batch)}.`,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign students to batch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Batch</DialogTitle>
          <DialogDescription>
            Assign {selectedStudentIds.length} selected student(s) to a
            batch/semester.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Selected Students:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedStudents.map((student) => (
                <div
                  key={student.id}
                  className="text-sm text-muted-foreground bg-muted p-2 rounded"
                >
                  {student.name} ({student.email})
                </div>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch/Semester</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a batch/semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Batch).map((batch) => (
                          <SelectItem key={batch} value={batch}>
                            {getBatchDisplayName(batch)}
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
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Assigning..." : "Assign Batch"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
