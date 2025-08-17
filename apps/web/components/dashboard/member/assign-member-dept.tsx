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
import { useSelector } from "react-redux";
import {
  Form,
  FormControl,
  FormDescription,
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
import { GraduationCap, Loader2 } from "lucide-react";
import {
  addDepartmentStudentSchema,
  type AddDepartmentStudentInput,
  type Member,
  Batch,
  Role,
  getBatchDisplayName,
} from "@/types/types";
import { RootState } from "@/lib/store/store";
import { postStudentToDepartment } from "@/lib/api/departments";

interface PromoteMembersProps {
  selectedMembers: Member[];
  onPromotionComplete?: () => void;
}

export function AssignMemberDept({
  selectedMembers,
  onPromotionComplete,
}: PromoteMembersProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const departments = useSelector(
    (state: RootState) => state.departments.departments,
  );

  const selectedOrganization = useSelector(
    (state: RootState) =>
      state.organizations.selectedOrganization ||
      state.organizations.userDefaultOrganization,
  );
  const batches = useSelector((state: RootState) => state.batches.batches);

  // Filter only students
  const studentMembers = selectedMembers.filter((member) =>
    member.roles.includes(Role.STUDENT),
  );

  const form = useForm<>({
    resolver: zodResolver(addDepartmentStudentSchema),
    defaultValues: {
      memberIds: studentMembers.map((member) => member.id),
      deptId: undefined,
    },
  });

  async function onSubmit(values: AddDepartmentStudentInput) {
    setIsLoading(true);
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const userIds = values.memberIds.map((id) => ({ userId: id }));

      console.log("*** Assigning department members:", userIds);

      const response = await postStudentToDepartment(
        selectedOrganization?.id,
        values.deptId,
        userIds,
      );

      console.log("*** Response from API:", response);
      // Here you would make the actual API call

      toast("Students added successfully", {
        description: `${userIds.length} student${userIds.length !== 1 ? "s" : ""} have been added.`,
      });

      form.reset();
      setOpen(false);
      onPromotionComplete?.();
    } catch (error) {
      toast("Failed to promote students", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (studentMembers.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <GraduationCap className="mr-2 h-4 w-4" />
          Add students to department ({studentMembers.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Students to Department</DialogTitle>
          <DialogDescription>
            Assign {studentMembers.length} selected student
            {studentMembers.length !== 1 ? "s" : ""} to a department.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium mb-2">Students to be assigned:</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {studentMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{member.name}</span>
                  <span className="text-muted-foreground">
                    {member.batch
                      ? getBatchDisplayName(member.batch)
                      : "No batch assigned"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="deptId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to Department</FormLabel>
                    <Select onValueChange={field.onChange} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments?.map((department) => (
                          <SelectItem
                            key={department.id}
                            value={String(department.id)}
                          >
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      All selected students will be moved to this department.
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
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Assign Department
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
