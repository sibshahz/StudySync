"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Play,
  Edit,
  Trash2,
  MessageSquare,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { deleteAgentById, getAgentList } from "@/lib/api/agents";

// Mock data for demonstration
// const mockAgents = [
//   {
//     id: "1",
//     name: "Customer Support Assistant",
//     description:
//       "Helps customers with product inquiries, troubleshooting, and general support questions. Trained on company knowledge base and support documentation.",
//     first_message:
//       "Hello! I'm here to help you with any questions about our products or services. How can I assist you today?",
//     status: "active",
//     createdAt: "2024-01-15",
//     lastUsed: "2024-01-20",
//     conversations: 156,
//   },
//   {
//     id: "2",
//     name: "Sales Assistant",
//     description:
//       "Qualified leads, provides product information, and helps potential customers understand pricing and features.",
//     first_message:
//       "Hi there! I'm excited to help you learn more about our solutions. What brings you here today?",
//     status: "active",
//     createdAt: "2024-01-10",
//     lastUsed: "2024-01-19",
//     conversations: 89,
//   },
//   {
//     id: "3",
//     name: "Technical Documentation Helper",
//     description:
//       "Assists developers and technical users with API documentation, code examples, and integration guidance.",
//     first_message:
//       "Welcome! I'm here to help you navigate our technical documentation and APIs. What are you looking to build?",
//     status: "draft",
//     createdAt: "2024-01-18",
//     lastUsed: null,
//     conversations: 0,
//   },
//   {
//     id: "4",
//     name: "HR Onboarding Bot",
//     description:
//       "Guides new employees through the onboarding process, answers policy questions, and helps with initial setup tasks.",
//     first_message:
//       "Congratulations on joining our team! I'm here to help make your onboarding smooth and answer any questions you have.",
//     status: "active",
//     createdAt: "2024-01-05",
//     lastUsed: "2024-01-18",
//     conversations: 34,
//   },
// ];

interface Agent {
  id: string;
  name: string;
  description: string;
  first_message: string;
  status: "active" | "draft" | "inactive";
  createdAt: string;
  lastUsed: string | null;
  conversations: number;
}

export default function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // Simulate fetching agents from an API
    const fetchAgents = async () => {
      // Replace with actual API call
      const response = await getAgentList();
      const data = await response.data;
      console.log("Fetched agents:", data);
      setAgents(data);
    };

    fetchAgents();
  }, []);
  const router = useRouter();
  const handleLaunch = (agent: Agent) => {
    toast.success(`Launching ${agent.name}`, {
      description: "Agent is now ready for conversations",
    });
    router.push(`/dashboard/agents/chat/${agent.id}`);
  };

  const handleUpdate = (agent: Agent) => {
    toast.info(`Opening editor for ${agent.name}`, {
      description: "Redirecting to agent configuration...",
    });
  };

  const handleDelete = async (agentId: string) => {
    console.log(`Deleting agent with ID: ${agentId}`);
    const result = await deleteAgentById(agentId);
    if (result.status !== 204) {
      toast.error("Failed to delete agent", {
        description: "Please try again later",
      });
      return;
    }
    // setAgents(agents.filter((agent) => agent.id !== agentId));
    toast.success("Agent deleted successfully", {
      description: "The agent has been permanently removed",
    });
    window.location.reload();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your AI Agents
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage and deploy your custom AI agents
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/agents/create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Bot className="w-4 h-4 mr-2" />
              Create New Agent
            </Button>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold truncate">
                        {agent.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="secondary"
                          className={getStatusColor("active")}
                        >
                          {"active"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleLaunch(agent)}>
                        <Play className="w-4 h-4 mr-2" />
                        Launch Agent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdate(agent)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Agent
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Agent
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{agent.name}"?
                              This action cannot be undone and will permanently
                              remove the agent and all its conversation history.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(agent.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <CardDescription className="text-sm line-clamp-3">
                  {agent.description}
                </CardDescription>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {
                      //generate random number of chats for demo purposes
                      24
                    }
                    chats
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(agent.createdAt)}
                  </div>
                </div>

                {agent.lastUsed && (
                  <div className="text-xs text-muted-foreground">
                    Last used: {formatDate(agent.lastUsed)}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleLaunch(agent)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    disabled={agent.status === "inactive"}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Launch
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdate(agent)}
                    className="px-3"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{agent.name}"? This
                          action cannot be undone and will permanently remove
                          the agent and all its conversation history.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(agent.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {agents.length === 0 && (
          <Card className="text-center py-12 border-dashed border-2">
            <CardContent>
              <Bot className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No agents yet</CardTitle>
              <CardDescription className="mb-4">
                Create your first AI agent to get started
              </CardDescription>
              <Button
                onClick={() => router.push("/dashboard/agents/create")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Bot className="w-4 h-4 mr-2" />
                Create Your First Agent
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
