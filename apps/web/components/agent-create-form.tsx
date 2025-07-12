"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Bot, MessageSquare, FileText, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { postCreateAgent } from "@/lib/api/agents";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Agent name must be at least 2 characters.",
    })
    .max(50, {
      message: "Agent name must not exceed 50 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must not exceed 500 characters.",
    }),
  first_message: z
    .string()
    .min(5, {
      message: "First message must be at least 5 characters.",
    })
    .max(200, {
      message: "First message must not exceed 200 characters.",
    }),
  prompt: z
    .string()
    .min(20, {
      message: "Prompt must be at least 20 characters.",
    })
    .max(2000, {
      message: "Prompt must not exceed 2000 characters.",
    }),
});

export default function AgentCreateForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      first_message: "",
      prompt: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await postCreateAgent(values);
    // Narrow result to expected type
    if (
      typeof result === "object" &&
      result !== null &&
      "status" in result &&
      typeof (result as any).status === "number"
    ) {
      if ((result as any).status !== 201) {
        toast.error("Failed to create agent. Please try again.");
        return;
      }
      toast.success("Agent created successfully!", {
        description: `${values.name} has been created and is ready to use.`,
      });
      console.log(values);
    } else {
      toast.error("Unexpected response from server.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 w-full">
      <div className="mx-auto max-w-4xl">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Agent
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Configure your AI agent with custom behavior and personality
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        Agent Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Customer Support Assistant"
                          className="h-12 text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Choose a descriptive name for your agent that reflects
                        its purpose.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what your agent does and its main capabilities..."
                          className="min-h-[100px] text-base resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a clear description of your agent's role and
                        capabilities.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        First Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Hello! I'm here to help you with..."
                          className="min-h-[80px] text-base resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The initial greeting message users will see when they
                        start a conversation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        System Prompt
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="You are a helpful assistant that specializes in... Your tone should be... When users ask about..."
                          className="min-h-[120px] text-base resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Define your agent's behavior, personality, and specific
                        instructions for handling conversations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ?
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Agent...
                      </>
                    : <>
                        <Bot className="w-4 h-4 mr-2" />
                        Create Agent
                      </>
                    }
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
