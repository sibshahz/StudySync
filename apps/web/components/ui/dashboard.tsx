"use client";

import { useState } from "react";
import {
  Bot,
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  Settings,
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useRouter } from "next/navigation";

// Mock data
const dashboardStats = [
  {
    title: "Total Agents",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: <Bot className="w-4 h-4" />,
  },
  {
    title: "Active Conversations",
    value: "1,847",
    change: "+23%",
    trend: "up",
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    title: "Success Rate",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    title: "Monthly Users",
    value: "12,459",
    change: "-3%",
    trend: "down",
    icon: <Users className="w-4 h-4" />,
  },
];

const conversationData = [
  { name: "Mon", conversations: 120, resolved: 98 },
  { name: "Tue", conversations: 145, resolved: 132 },
  { name: "Wed", conversations: 167, resolved: 156 },
  { name: "Thu", conversations: 189, resolved: 178 },
  { name: "Fri", conversations: 234, resolved: 221 },
  { name: "Sat", conversations: 198, resolved: 187 },
  { name: "Sun", conversations: 156, resolved: 142 },
];

const agentPerformanceData = [
  { name: "Support Bot", usage: 85, satisfaction: 4.8 },
  { name: "Sales Assistant", usage: 72, satisfaction: 4.6 },
  { name: "Tech Helper", usage: 68, satisfaction: 4.9 },
  { name: "HR Bot", usage: 45, satisfaction: 4.4 },
  { name: "Marketing AI", usage: 38, satisfaction: 4.7 },
];

const recentActivity = [
  {
    id: 1,
    type: "agent_created",
    message: "New agent 'Product Advisor' was created",
    time: "2 minutes ago",
    user: "Sarah Chen",
  },
  {
    id: 2,
    type: "conversation_completed",
    message: "Customer support conversation resolved successfully",
    time: "5 minutes ago",
    user: "Support Bot",
  },
  {
    id: 3,
    type: "agent_updated",
    message: "Sales Assistant configuration updated",
    time: "12 minutes ago",
    user: "Mike Rodriguez",
  },
  {
    id: 4,
    type: "high_volume",
    message: "High conversation volume detected on Tech Helper",
    time: "18 minutes ago",
    user: "System",
  },
  {
    id: 5,
    type: "agent_deployed",
    message: "HR Onboarding Bot deployed to production",
    time: "1 hour ago",
    user: "Emily Johnson",
  },
];

const topAgents = [
  {
    id: 1,
    name: "Customer Support Assistant",
    status: "active",
    conversations: 456,
    satisfaction: 4.8,
    uptime: 99.9,
  },
  {
    id: 2,
    name: "Sales Assistant",
    status: "active",
    conversations: 234,
    satisfaction: 4.6,
    uptime: 98.7,
  },
  {
    id: 3,
    name: "Technical Documentation Helper",
    status: "paused",
    conversations: 189,
    satisfaction: 4.9,
    uptime: 97.2,
  },
  {
    id: 4,
    name: "HR Onboarding Bot",
    status: "active",
    conversations: 123,
    satisfaction: 4.4,
    uptime: 99.1,
  },
];

export default function DashboardComponent() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "agent_created":
        return <Plus className="w-4 h-4 text-green-600" />;
      case "conversation_completed":
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case "agent_updated":
        return <Settings className="w-4 h-4 text-orange-600" />;
      case "high_volume":
        return <Activity className="w-4 h-4 text-red-600" />;
      case "agent_deployed":
        return <Play className="w-4 h-4 text-purple-600" />;
      default:
        return <Bot className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Agents Inc
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search agents, conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/dashboard/agents/create")}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Agent
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, John!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your AI agents today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium">2 minutes ago</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.trend === "up" ?
                        <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                      : <ArrowDown className="w-4 h-4 text-red-600 mr-1" />}
                      <span
                        className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversation Trends */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Conversation Trends</CardTitle>
              <CardDescription>
                Daily conversation volume and resolution rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  conversations: {
                    label: "Conversations",
                    color: "hsl(var(--chart-1))",
                  },
                  resolved: {
                    label: "Resolved",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={conversationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="conversations"
                      stroke="var(--color-conversations)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="var(--color-resolved)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Agent Performance */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Agent Performance</CardTitle>
              <CardDescription>
                Usage and satisfaction ratings by agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  usage: {
                    label: "Usage %",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentPerformanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="usage" fill="var(--color-usage)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your agents and team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {activity.user}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Agents */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Top Agents</CardTitle>
              <CardDescription>Your best performing agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {agent.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className={getStatusColor(agent.status)}
                          >
                            {agent.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {agent.conversations} chats
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Agent</DropdownMenuItem>
                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
