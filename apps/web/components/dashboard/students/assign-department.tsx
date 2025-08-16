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
  assignStudentDepartmentSchema,
  type AssignStudentDepartmentInput,
  Department,
  getDepartmentDisplayName,
  type Student,
} from "@/types/types";

interface AssignDepartmentProps {
  students: Student[];
  selectedStudentIds: number[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (data: AssignStudentDepartmentInput) => Promise<void>;
}

export function AssignDepartment({
  students,
  selectedStudentIds,
  open,
  onOpenChange,
  onAssign,
}: AssignDepartmentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AssignStudentDepartmentInput>({
    resolver: zodResolver(assignStudentDepartmentSchema),
    defaultValues: {
      studentIds: selectedStudentIds,
      department: undefined,
    },
  });

  const selectedStudents = students.filter((student) =>
    selectedStudentIds.includes(student.id),
  );

  const onSubmit = async (data: AssignStudentDepartmentInput) => {
    try {
      setIsLoading(true);
      await onAssign(data);
      toast({
        title: "Success",
        description: `Successfully assigned ${selectedStudentIds.length} student(s) to ${getDepartmentDisplayName(data.department)}.`,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to assign students to department. Please try again.",
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
          <DialogTitle>Assign Department</DialogTitle>
          <DialogDescription>
            Assign {selectedStudentIds.length} selected student(s) to a
            department.
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
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Department).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {getDepartmentDisplayName(dept)}
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
                  {isLoading ? "Assigning..." : "Assign Department"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
