import { NavMain } from "@/components/app-sidebar/nav-main";
import { NavUser } from "@/components/app-sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/use-direction";
import { LayoutDashboard } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { setOpenMobile } = useSidebar();
  const direction = useDirection();

  return (
    <Sidebar side={direction === "rtl" ? "right" : "left"} collapsible="icon" {...props}>
      <SidebarHeader>
        <Link onClick={() => setOpenMobile(false)} to="/">
          <SidebarMenuButton
            size="lg"
            className="gap-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <LayoutDashboard />
            </div>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">{t("appName")}</span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
