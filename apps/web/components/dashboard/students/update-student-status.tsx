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
  updateStudentStatusSchema,
  type UpdateStudentStatusInput,
  Status,
  getStatusDisplayName,
  getStatusColor,
  type Student,
} from "@/types/types";
import { Badge } from "@/components/ui/badge";

interface UpdateStudentStatusProps {
  students: Student[];
  selectedStudentIds: number[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (data: UpdateStudentStatusInput) => Promise<void>;
}

export function UpdateStudentStatus({
  students,
  selectedStudentIds,
  open,
  onOpenChange,
  onUpdateStatus,
}: UpdateStudentStatusProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<UpdateStudentStatusInput>({
    resolver: zodResolver(updateStudentStatusSchema),
    defaultValues: {
      studentIds: selectedStudentIds,
      status: undefined,
    },
  });

  const selectedStudents = students.filter((student) =>
    selectedStudentIds.includes(student.id),
  );

  const onSubmit = async (data: UpdateStudentStatusInput) => {
    try {
      setIsLoading(true);
      await onUpdateStatus(data);
      toast({
        title: "Success",
        description: `Successfully updated status for ${selectedStudentIds.length} student(s) to ${getStatusDisplayName(data.status)}.`,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student status. Please try again.",
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
          <DialogTitle>Update Student Status</DialogTitle>
          <DialogDescription>
            Update the status for {selectedStudentIds.length} selected
            student(s).
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Selected Students:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedStudents.map((student) => (
                <div
                  key={student.id}
                  className="text-sm text-muted-foreground bg-muted p-2 rounded flex justify-between items-center"
                >
                  <span>
                    {student.name} ({student.email})
                  </span>
                  <Badge className={getStatusColor(student.status)}>
                    {getStatusDisplayName(student.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(Status).map((status) => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(status)}>
                                {getStatusDisplayName(status)}
                              </Badge>
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
                  {isLoading ? "Updating..." : "Update Status"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
