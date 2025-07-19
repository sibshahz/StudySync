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
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
        {
          title: "Activity Logs",
          url: "/dashboard/activity-logs",
        },
        {
          title: "Notifications",
          url: "/dashboard/notifications",
        },
      ],
    },

    {
      title: "Organization",
      url: "/dashboard/organization",
      icon: Building2,
      items: [
        {
          title: "Overview",
          url: "/dashboard/organizations",
        },
        {
          title: "Departments",
          url: "/dashboard/organizations/departments",
        },
        {
          title: "Roles & Permissions",
          url: "/dashboard/organizations/roles",
        },
        {
          title: "Members",
          url: "/dashboard/organizations/members",
        },
      ],
    },
    {
      title: "Teachers",
      url: "/dashboard/teachers",
      icon: UserCog,
      items: [
        {
          title: "All Teachers",
          url: "/dashboard/teachers",
        },
        {
          title: "Assign Courses",
          url: "/dashboard/teachers/assignments",
        },
        {
          title: "Attendance",
          url: "/dashboard/teachers/attendance",
        },
      ],
    },
    {
      title: "Students",
      url: "/dashboard/students",
      icon: Users2,
      items: [
        {
          title: "All Students",
          url: "/dashboard/students",
        },
        {
          title: "Admissions",
          url: "/dashboard/students/admissions",
        },
        {
          title: "Enrollment Status",
          url: "/dashboard/students/enrollment",
        },
      ],
    },
    {
      title: "Semesters",
      url: "/dashboard/semesters",
      icon: CalendarDays,
      items: [
        {
          title: "All Semesters",
          url: "/dashboard/semesters",
        },
        {
          title: "Create Semester",
          url: "/dashboard/semesters/create",
        },
        {
          title: "Semester Calendar",
          url: "/dashboard/semesters/calendar",
        },
      ],
    },
    {
      title: "Courses & Assignments",
      url: "/dashboard/courses",
      icon: BookOpen,
      items: [
        {
          title: "Courses",
          url: "/dashboard/courses",
        },
        {
          title: "Assignments",
          url: "/dashboard/assignments",
        },
        {
          title: "Quizzes",
          url: "/dashboard/quizzes",
        },
      ],
    },
    {
      title: "FYP Management",
      url: "/dashboard/fyp",
      icon: FlaskConical,
      items: [
        {
          title: "Projects",
          url: "/dashboard/fyp/projects",
        },
        {
          title: "Supervisors",
          url: "/dashboard/fyp/supervisors",
        },
        {
          title: "Evaluations",
          url: "/dashboard/fyp/evaluations",
        },
      ],
    },
    {
      title: "Grading & Results",
      url: "/dashboard/grading",
      icon: ClipboardCheck,
      items: [
        {
          title: "Grading Schemes",
          url: "/dashboard/grading/schemes",
        },
        {
          title: "Results",
          url: "/dashboard/grading/results",
        },
        {
          title: "Reports",
          url: "/dashboard/grading/reports",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
        {
          title: "Team",
          url: "/dashboard/settings/team",
        },
        {
          title: "Billing",
          url: "/dashboard/settings/billing",
        },
        {
          title: "Access Control",
          url: "/dashboard/settings/access",
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
