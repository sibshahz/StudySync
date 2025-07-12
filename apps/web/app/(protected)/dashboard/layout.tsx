"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/components/auth-provider";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserDropdown from "@/components/user-dropdown";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  console.log("AppSidebar user:", user);

  return (
    <SidebarProvider className="overflow-x-hidden">
      <AppSidebar />
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />

          <UserDropdown />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 w-full">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
