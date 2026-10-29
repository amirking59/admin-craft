import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
        <AppHeader />

        <div className="flex flex-1 flex-col p-4 pt-0">
          <div className="container mx-auto py-6">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
