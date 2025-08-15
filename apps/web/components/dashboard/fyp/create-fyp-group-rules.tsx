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
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";
import {
  createFYPGroupRulesSchema,
  type CreateFYPGroupRulesInput,
  type BatchEntity,
} from "@/types/types";
import { createFYPGroupRules } from "@/lib/api/fypGroupRules";
import { getAllBatches } from "@/lib/api/batches";
import type { RootState } from "@/lib/store/store";

interface CreateFYPGroupRulesProps {
  onGroupRulesCreated: () => void;
}

export function CreateFYPGroupRules({ onGroupRulesCreated }: CreateFYPGroupRulesProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [batches, setBatches] = useState<BatchEntity[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(true);
  
  // Get selected organization from Redux store
  const selectedOrganization = useSelector((state: RootState) => state.organizations.selectedOrganization);

  const form = useForm<CreateFYPGroupRulesInput>({
    resolver: zodResolver(createFYPGroupRulesSchema),
    defaultValues: {
      batchId: 0,
      minMembers: 1,
      maxMembers: 4,
    },
  });

  // Fetch batches when component mounts or organization changes
  useEffect(() => {
    const fetchBatches = async () => {
      if (!selectedOrganization?.id) {
        setBatches([]);
        setLoadingBatches(false);
        return;
      }

      setLoadingBatches(true);
      try {
        const fetchedBatches = await getAllBatches(selectedOrganization.id.toString());
        setBatches(fetchedBatches || []);
      } catch (error) {
        console.error("Error fetching batches:", error);
        toast("Error loading batches", {
          description: "Could not load batches. Please try again.",
        });
        setBatches([]);
      } finally {
        setLoadingBatches(false);
      }
    };

    fetchBatches();
  }, [selectedOrganization?.id]);

  const onSubmit = async (data: CreateFYPGroupRulesInput) => {
    if (!selectedOrganization) {
      toast("Error", {
        description: "Please select an organization first.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createFYPGroupRules(data);

      const selectedBatch = batches.find(b => b.id === data.batchId);
      toast("FYP group rules created successfully", {
        description: `Group rules for ${selectedBatch?.name || 'batch'} set to ${data.minMembers}-${data.maxMembers} members`,
      });

      form.reset();
      setOpen(false);
      onGroupRulesCreated();
    } catch (error: any) {
      toast("Error creating FYP group rules", {
        description: error?.response?.data?.message || "There was a problem creating the FYP group rules. Please try again.",
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Group Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create FYP Group Rules</DialogTitle>
          <DialogDescription>
            Set member limits for Final Year Project groups for a specific batch.
            This will control how many students can be in each FYP group.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="batchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a batch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingBatches ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="ml-2 text-sm">Loading batches...</span>
                        </div>
                      ) : batches.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          {selectedOrganization ? "No batches found" : "Please select an organization first"}
                        </div>
                      ) : (
                        batches.map((batch) => (
                          <SelectItem
                            key={batch.id}
                            value={batch.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <span>{batch.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ({batch.batchCode} - {batch.departmentName})
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the batch for which you want to set group rules
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Rules
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
