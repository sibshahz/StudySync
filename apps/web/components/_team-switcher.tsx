"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, University } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { Organization } from "@repo/database/enums";
import { getAllOrganizations } from "@/lib/api/organization";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/store/store";
import {
  fetchOrganizations,
  setSelectedOrganization,
} from "@/lib/store/common/orgsSlice";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  // const [activeTeam, setActiveTeam] = React.useState(teams[0]);
  const [orgs, setOrgs] = React.useState<Organization[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const selectedOrganization = useSelector(
    (state: RootState) => state.organizations.selectedOrganization,
  );
  const { userOrganizations, status } = useSelector(
    (state: RootState) => state.organizations,
  );

  // React.useEffect(() => {
  //   async function fetchOrgs() {
  //     // Simulate fetching organizations from an API or context
  //     const fetchedOrganizations = await getAllOrganizations();
  //     console.log(
  //       "***Fetched Organizations from teams swithcher:",
  //       fetchedOrganizations,
  //     );
  //     setOrgs(fetchedOrganizations);
  //   }

  //   // Fetch organizations from the server or context
  //   // setOrgs(fetchedOrganizations);
  //   fetchOrgs();
  // }, []);

  React.useEffect(() => {
    if (status === "idle") {
      dispatch(fetchOrganizations());
    }
  }, [status]);

  if (!selectedOrganization) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {/* <activeTeam.logo className="size-4" /> */}
                <University className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {selectedOrganization.name}
                </span>
                {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Organizations
            </DropdownMenuLabel>
            {userOrganizations.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                // onClick={() => setActiveTeam(team)}
                onClick={() => dispatch(setSelectedOrganization(team))}
                className="gap-2 p-2"
              >
                {/* <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div> */}
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
