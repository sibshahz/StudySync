import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRole } from "@repo/database/enums";
import { AppSidebar } from "@/components/_app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NextBreadcrumb from "@/components/bread-crumbs";
import { ChevronRight } from "lucide-react";
import { LmsAppSidebar } from "@/components/lms-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute
      requiredRoles={[UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN]}
    >
      <SidebarProvider>
        <LmsAppSidebar showswitcher={true} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              {/* <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb> */}
              <NextBreadcrumb
                homeElement={"/"}
                separator={
                  <span>
                    {" "}
                    <ChevronRight
                      className="text-gray-300 text-sm"
                      size={20}
                    />{" "}
                  </span>
                }
                activeClasses="text-gray-900 font-bold text-underline active:text-gray-900"
                containerClasses="flex py-2 items-center"
                listClasses="hover:underline mx-2 font-light text-sm"
                capitalizeLinks
              />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
