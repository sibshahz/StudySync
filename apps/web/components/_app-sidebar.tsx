"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Building2,
  CalendarDays,
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
  UserCog,
  Users2,
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

// This is sample data.
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
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/admin/dashboard",
        },
        {
          title: "Activity Logs",
          url: "/admin/activity-logs",
        },
        {
          title: "Notifications",
          url: "/admin/notifications",
        },
      ],
    },
    {
      title: "Students",
      url: "/admin/students",
      icon: Users2,
      items: [
        {
          title: "All Students",
          url: "/admin/students",
        },
        {
          title: "Admissions",
          url: "/admin/students/admissions",
        },
        {
          title: "Enrollment Status",
          url: "/admin/students/enrollment",
        },
      ],
    },
    {
      title: "Teachers",
      url: "/admin/teachers",
      icon: UserCog,
      items: [
        {
          title: "All Teachers",
          url: "/admin/teachers",
        },
        {
          title: "Assign Courses",
          url: "/admin/teachers/assignments",
        },
        {
          title: "Attendance",
          url: "/admin/teachers/attendance",
        },
      ],
    },
    {
      title: "Semesters",
      url: "/admin/semesters",
      icon: CalendarDays,
      items: [
        {
          title: "All Semesters",
          url: "/admin/semesters",
        },
        {
          title: "Create Semester",
          url: "/admin/semesters/create",
        },
        {
          title: "Semester Calendar",
          url: "/admin/semesters/calendar",
        },
      ],
    },
    {
      title: "Courses & Assignments",
      url: "/admin/courses",
      icon: BookOpen,
      items: [
        {
          title: "Courses",
          url: "/admin/courses",
        },
        {
          title: "Assignments",
          url: "/admin/assignments",
        },
        {
          title: "Quizzes",
          url: "/admin/quizzes",
        },
      ],
    },
    {
      title: "FYP Management",
      url: "/admin/fyp",
      icon: FlaskConical,
      items: [
        {
          title: "Projects",
          url: "/admin/fyp/projects",
        },
        {
          title: "Supervisors",
          url: "/admin/fyp/supervisors",
        },
        {
          title: "Evaluations",
          url: "/admin/fyp/evaluations",
        },
      ],
    },
    {
      title: "Grading & Results",
      url: "/admin/grading",
      icon: ClipboardCheck,
      items: [
        {
          title: "Grading Schemes",
          url: "/admin/grading/schemes",
        },
        {
          title: "Results",
          url: "/admin/grading/results",
        },
        {
          title: "Reports",
          url: "/admin/grading/reports",
        },
      ],
    },
    {
      title: "Organization",
      url: "/admin/organization",
      icon: Building2,
      items: [
        {
          title: "Departments",
          url: "/admin/organization/departments",
        },
        {
          title: "Roles & Permissions",
          url: "/admin/organization/roles",
        },
        {
          title: "Members",
          url: "/admin/organization/members",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/admin/settings/general",
        },
        {
          title: "Team",
          url: "/admin/settings/team",
        },
        {
          title: "Billing",
          url: "/admin/settings/billing",
        },
        {
          title: "Access Control",
          url: "/admin/settings/access",
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

export function AppSidebar({ ...props }: AppSidebarProps) {
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
