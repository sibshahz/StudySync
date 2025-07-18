"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Building2,
  ClipboardCheck,
  Command,
  FileText,
  FlaskConical,
  Frame,
  GalleryVerticalEnd,
  GraduationCap,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { NavMain } from "@/components/_nav-main";
import { NavProjects } from "@/components/_nav-projects";
import { NavUser } from "@/components/_nav-user";
import { TeamSwitcher } from "@/components/_team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/lms",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/lms",
        },
        {
          title: "Notifications",
          url: "/lms/notifications",
        },
      ],
    },
    {
      title: "Courses",
      url: "/lms/courses",
      icon: BookOpen,
      isActive: false,
      items: [
        {
          title: "My Batches",
          url: "/lms/courses/batches",
        },
        {
          title: "Assignments",
          url: "/lms/courses/assignments",
        },
        {
          title: "Quizzes",
          url: "/lms/courses/quizzes",
        },
      ],
    },
    {
      title: "FYP",
      url: "/lms/fyp",
      icon: FlaskConical,
      isActive: false,
      items: [
        {
          title: "My Project",
          url: "/lms/fyp/project",
        },
        {
          title: "Supervisor",
          url: "/lms/fyp/supervisor",
        },
        {
          title: "Evaluation",
          url: "/lms/fyp/evaluation",
        },
      ],
    },
    {
      title: "Grades",
      url: "/lms/grades",
      icon: ClipboardCheck,
      isActive: false,
      items: [
        {
          title: "Grading Scheme",
          url: "/lms/grades/scheme",
        },
        {
          title: "Results",
          url: "/lms/grades/results",
        },
        {
          title: "Transcript",
          url: "/lms/grades/transcript",
        },
      ],
    },
    {
      title: "Profile",
      url: "/lms/profile",
      icon: User,
      isActive: false,
      items: [
        {
          title: "View Profile",
          url: "/lms/profile/view",
        },
        {
          title: "Edit Profile",
          url: "/lms/profile/edit",
        },
        {
          title: "Settings",
          url: "/lms/profile/settings",
        },
      ],
    },
  ],

  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  showSwitcher?: boolean;
}

export function LmsAppSidebar({ ...props }: AppSidebarProps) {
  const { user } = useAuth();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {props.showSwitcher && (
          <div className="mb-4">
            <TeamSwitcher teams={data.teams} />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
