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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Settings, Info } from "lucide-react";
import { toast } from "sonner";
import {
  editFYPGroupRulesSchema,
  type EditFYPGroupRulesInput,
  type FYPGroupRules,
} from "@/types/types";
import { updateFYPGroupRules } from "@/lib/api/fypGroupRules";

interface EditFYPGroupRulesProps {
  groupRules: FYPGroupRules | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupRulesUpdated: () => void;
}

export function EditFYPGroupRules({
  groupRules,
  open,
  onOpenChange,
  onGroupRulesUpdated,
}: EditFYPGroupRulesProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditFYPGroupRulesInput>({
    resolver: zodResolver(editFYPGroupRulesSchema),
    defaultValues: {
      id: 0,
      batchId: 0,
      minMembers: 1,
      maxMembers: 4,
    },
  });

  useEffect(() => {
    if (groupRules) {
      form.reset({
        id: groupRules.id,
        batchId: groupRules.batchId,
        minMembers: groupRules.minMembers,
        maxMembers: groupRules.maxMembers,
      });
    }
  }, [groupRules, form]);

  const onSubmit = async (data: EditFYPGroupRulesInput) => {
    setIsLoading(true);
    try {
      await updateFYPGroupRules(data);

      toast("FYP group rules updated successfully", {
        description: `Group rules for ${groupRules?.batchName || groupRules?.batch?.name || 'batch'} updated to ${data.minMembers}-${data.maxMembers} members`,
      });

      onOpenChange(false);
      onGroupRulesUpdated();
    } catch (error: any) {
      toast("Error updating FYP group rules", {
        description: error?.response?.data?.message || "There was a problem updating the FYP group rules. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Watch minMembers and maxMembers to ensure consistency
  const watchedMinMembers = form.watch("minMembers");
  const watchedMaxMembers = form.watch("maxMembers");

  const handleMinMembersChange = (value: string) => {
    const minValue = parseInt(value);
    form.setValue("minMembers", minValue);
    
    // Auto-adjust max members if it's less than min
    if (watchedMaxMembers < minValue) {
      form.setValue("maxMembers", minValue);
    }
  };

  const handleMaxMembersChange = (value: string) => {
    const maxValue = parseInt(value);
    form.setValue("maxMembers", maxValue);
    
    // Auto-adjust min members if it's greater than max
    if (watchedMinMembers > maxValue) {
      form.setValue("minMembers", maxValue);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit FYP Group Rules</DialogTitle>
          <DialogDescription>
            Update member limits for Final Year Project groups. These changes 
            will apply to all future group formations for this batch.
          </DialogDescription>
        </DialogHeader>

        {/* Batch Information */}
        {groupRules && (
          <div className="p-3 bg-muted rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Info className="h-4 w-4" />
              <span>Batch Information</span>
            </div>
            <div className="text-sm text-muted-foreground pl-6">
              <div><strong>Batch:</strong> {groupRules.batchName || groupRules.batch?.name || "N/A"}</div>
              <div><strong>Department:</strong> {groupRules.departmentName || groupRules.batch?.department?.name || "N/A"}</div>
              {groupRules.batch?.batchCode && (
                <div><strong>Code:</strong> {groupRules.batch.batchCode}</div>
              )}
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Members</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value) || 1);
                          handleMinMembersChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum students per group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Members</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="4"
                        min={1}
                        max={10}
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value) || 1);
                          handleMaxMembersChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum students per group
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Preview */}
            {watchedMinMembers && watchedMaxMembers && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Settings className="h-4 w-4" />
                  <span>
                    Groups will be limited to <strong>{watchedMinMembers}</strong> to{" "}
                    <strong>{watchedMaxMembers}</strong> members
                  </span>
                </div>
                {groupRules && (
                  <div className="text-xs text-muted-foreground mt-1 pl-6">
                    Previous limits: {groupRules.minMembers}-{groupRules.maxMembers} members
                  </div>
                )}
              </div>
            )}

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
                Update Rules
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
