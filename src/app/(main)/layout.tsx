"use client";

import { AppSidebar } from "@/app/(main)/_components/sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1" />

              <div className="flex-1"></div>
            </div>
          </header>

          <div className="flex flex-1 flex-col p-4 pt-0">
            <div className="container mx-auto py-6">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
