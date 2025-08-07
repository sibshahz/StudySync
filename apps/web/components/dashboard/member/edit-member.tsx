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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import {
  editMemberSchema,
  type EditMemberInput,
  type Member,
  Role,
  Status,
  Department,
  Batch,
  getRoleDisplayName,
  getStatusDisplayName,
  getDepartmentDisplayName,
  getBatchDisplayName,
} from "@/types/types";

interface EditMemberProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberUpdated?: () => void;
}

export function EditMember({
  member,
  open,
  onOpenChange,
  onMemberUpdated,
}: EditMemberProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<EditMemberInput>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      id: member.id,
      name: member.name,
      email: member.email,
      roles: member.roles,
      status: member.status,
      department: member.department,
      batch: member.batch,
    },
  });

  // Reset form when member changes
  useEffect(() => {
    form.reset({
      id: member.id,
      name: member.name,
      email: member.email,
      roles: member.roles,
      status: member.status,
      department: member.department,
      batch: member.batch,
    });
  }, [member, form]);

  async function onSubmit(values: EditMemberInput) {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      console.log("Updating member:", values);

      toast("Member updated successfully", {
        description: "The changes have been saved.",
      });

      onOpenChange(false);
      onMemberUpdated?.();
    } catch (error) {
      toast("Failed to update member", {
        description:
          "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const selectedRoles = form.watch("roles");
  const isStudent = selectedRoles.includes(Role.STUDENT);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Make changes to the member details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter full name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Roles</FormLabel>
                    <FormDescription>
                      Select one or more roles for this member.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.values(Role).map((role) => (
                      <FormField
                        key={role}
                        control={form.control}
                        name="roles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, role])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== role,
                                          ),
                                        );
                                  }}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {getRoleDisplayName(role)}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Status).map((status) => (
                        <SelectItem key={status} value={status}>
                          {getStatusDisplayName(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isStudent && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
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
                      <FormDescription>Required for students.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="batch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch/Semester</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select batch" />
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
                      <FormDescription>
                        Current semester for students.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

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
