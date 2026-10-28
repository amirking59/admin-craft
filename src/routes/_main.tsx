import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAccessToken } from "@/features/auth/services";

// Every page under this layout needs a login.
export const Route = createFileRoute("/_main")({
  beforeLoad: () => {
    if (!getAccessToken()) throw redirect({ to: "/auth" });
  },
  component: Layout,
});

function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ms-1" />

            <div className="flex-1"></div>
          </div>
        </header>

        <div className="flex flex-1 flex-col p-4 pt-0">
          <div className="container mx-auto py-6">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
