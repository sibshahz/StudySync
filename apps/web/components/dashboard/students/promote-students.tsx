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
  promoteStudentsSchema,
  type PromoteStudentsInput,
  Batch,
  getBatchDisplayName,
  getNextSemester,
  type Student,
} from "@/types/types";
import { AlertTriangle } from "lucide-react";

interface PromoteStudentsProps {
  students: Student[];
  selectedStudentIds: number[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPromote: (data: PromoteStudentsInput) => Promise<void>;
}

export function PromoteStudents({
  students,
  selectedStudentIds,
  open,
  onOpenChange,
  onPromote,
}: PromoteStudentsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PromoteStudentsInput>({
    resolver: zodResolver(promoteStudentsSchema),
    defaultValues: {
      studentIds: selectedStudentIds,
      newBatch: undefined,
    },
  });

  const selectedStudents = students?.filter((student) =>
    selectedStudentIds.includes(student.id),
  );

  // Get suggested next semester based on current batches
  const suggestedBatches = new Set<Batch>();
  selectedStudents?.forEach((student) => {
    if (student.batch) {
      const nextSemester = getNextSemester(student.batch);
      if (nextSemester) {
        suggestedBatches.add(nextSemester);
      }
    }
  });

  const onSubmit = async (data: PromoteStudentsInput) => {
    try {
      setIsLoading(true);
      await onPromote(data);
      toast({
        title: "Success",
        description: `Successfully promoted ${selectedStudentIds.length} student(s) to ${data.newBatch}.`,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to promote students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Promote Students</DialogTitle>
          <DialogDescription>
            Promote {selectedStudentIds.length} selected student(s) to the next
            semester.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Selected Students:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedStudents?.map((student) => (
                <div
                  key={student.id}
                  className="text-sm text-muted-foreground bg-muted p-2 rounded flex justify-between items-center"
                >
                  <span>
                    {student.name} ({student.email})
                  </span>
                  <span className="text-xs">
                    Current:{" "}
                    {student.batch
                      ? getBatchDisplayName(student.batch)
                      : "Unassigned"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {suggestedBatches.size > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Suggested Promotions
                </span>
              </div>
              <div className="text-xs text-blue-700">
                Based on current batches:{" "}
                {Array.from(suggestedBatches)
                  .map((batch) => getBatchDisplayName(batch))
                  .join(", ")}
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newBatch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promote to Batch/Semester</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target batch/semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Batch).map((batch) => (
                          <SelectItem key={batch} value={batch}>
                            <div className="flex items-center justify-between w-full">
                              <span>{getBatchDisplayName(batch)}</span>
                              {suggestedBatches.has(batch) && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1 rounded">
                                  Suggested
                                </span>
                              )}
                            </div>
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
                  {isLoading ? "Promoting..." : "Promote Students"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
