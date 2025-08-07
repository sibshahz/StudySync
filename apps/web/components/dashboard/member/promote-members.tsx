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
  promoteMemberSchema,
  type PromoteMemberInput,
  type Member,
  Batch,
  Role,
  getBatchDisplayName,
} from "@/types/types";

interface PromoteMembersProps {
  selectedMembers: Member[];
  onPromotionComplete?: () => void;
}

export function PromoteMembers({
  selectedMembers,
  onPromotionComplete,
}: PromoteMembersProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Filter only students
  const studentMembers = selectedMembers.filter((member) =>
    member.roles.includes(Role.STUDENT),
  );

  const form = useForm<PromoteMemberInput>({
    resolver: zodResolver(promoteMemberSchema),
    defaultValues: {
      memberIds: studentMembers.map((member) => member.id),
      newBatch: undefined,
    },
  });

  async function onSubmit(values: PromoteMemberInput) {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Here you would make the actual API call
      console.log("Promoting members:", values);

      toast("Students promoted successfully", {
        description: `${values.memberIds.length} student${values.memberIds.length !== 1 ? "s" : ""} have been promoted.`,
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
          Promote Students ({studentMembers.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Promote Students</DialogTitle>
          <DialogDescription>
            Promote {studentMembers.length} selected student
            {studentMembers.length !== 1 ? "s" : ""} to the next semester.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium mb-2">Students to be promoted:</h4>
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
                name="newBatch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promote to Semester</FormLabel>
                    <Select onValueChange={field.onChange} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target semester" />
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
                      All selected students will be moved to this semester.
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
                  Promote Students
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
