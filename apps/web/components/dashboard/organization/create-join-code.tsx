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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Plus, Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  createJoinCodeSchema,
  type CreateJoinCodeInput,
  type Organization,
  Role,
  getRoleDisplayName,
  generateJoinCode,
} from "@/types/types";
import { createJoinCode } from "@/lib/api/joincode";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";

interface CreateJoinCodeProps {
  onJoinCodeCreated?: () => void;
}

export function CreateJoinCode({ onJoinCodeCreated }: CreateJoinCodeProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const organizations = useSelector(
    (state: RootState) => state.organizations.userOrganizations,
  );
  const { toast } = useToast();

  const form = useForm<CreateJoinCodeInput>({
    resolver: zodResolver(createJoinCodeSchema),
    defaultValues: {
      organizationId: undefined,
      role: undefined,
      usageLimit: null,
      expiresAt: null,
    },
  });

  // Mock organizations data
  // const mockOrganizations: Organization[] = [
  //   {
  //     id: 1,
  //     name: "University of Technology",
  //     createdAt: new Date("2024-01-15"),
  //     updatedAt: new Date("2024-01-15"),
  //   },
  //   {
  //     id: 2,
  //     name: "State College of Engineering",
  //     createdAt: new Date("2024-01-20"),
  //     updatedAt: new Date("2024-02-01"),
  //   },
  //   {
  //     id: 3,
  //     name: "Metropolitan University",
  //     createdAt: new Date("2024-02-05"),
  //     updatedAt: new Date("2024-02-05"),
  //   },
  // ];

  // useEffect(() => {
  //   // Fetch organizations
  //   setOrganizations(mockOrganizations);
  // }, []);

  async function onSubmit(values: CreateJoinCodeInput) {
    setIsLoading(true);
    try {
      // Generate unique code
      // const code = generateJoinCode();
      const response = await createJoinCode({
        organizationId: values.organizationId,
        role: values.role,
        usageLimit: values.usageLimit ?? null,
        expiresAt: values.expiresAt ?? null,
      });

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));  // useEffect(() => {
      //   // Fetch organizations
      //   setOrganizations(mockOrganizations);
      // }, []);

      // Here you would make the actual API call
      // console.log("Creating join code:", { ...values, code });

      toast({
        title: "Success",
        description: `Join code ${response.data.code} created successfully.`,
      });

      form.reset();
      setOpen(false);
      onJoinCodeCreated?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create join code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Join Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Join Code</DialogTitle>
          <DialogDescription>
            Create a new join code for users to register with a specific role
            and organization.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(Number.parseInt(value))
                    }
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id.toString()}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The organization this join code will be associated with.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Role).map((role) => (
                        <SelectItem key={role} value={role}>
                          {getRoleDisplayName(role)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The role that will be assigned to users who use this code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              {
                <FormField
                  control={form.control}
                  name="usageLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter usage limit"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseInt(e.target.value)
                                : null,
                            )
                          }
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of times this code can be used.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              }
            </div>

            <div className="space-y-4">
              {
                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiration Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                              disabled={isLoading}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value || undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        The date when this join code will expire.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              }
            </div>

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
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Join Code
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
