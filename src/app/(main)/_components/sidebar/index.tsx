"use client";

import { NavMain } from "@/app/(main)/_components/sidebar/_components/nav-main";
import { NavUser } from "@/app/(main)/_components/sidebar/_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useLocale } from "@/hooks/use-locale";
import { useTranslation } from "react-i18next";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const [locale] = useLocale();
  const { setOpenMobile } = useSidebar();
  const isRtl = locale === "fa";

  return (
    <Sidebar side={isRtl ? "right" : "left"} collapsible="icon" {...props}>
      <SidebarHeader>
        <Link onClick={() => setOpenMobile(false)} href={"/"}>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3"
          >
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
              <img src="/logo.svg" alt="Balinex logo" width="45" height="45" style={{ verticalAlign: "middle" }}></img>
            </div>
            <div className="grid flex-1 text-start text-sm leading-tight">
              <span className="truncate font-medium">{t("balinex")}</span>
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
