"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

import { useTranslation } from "react-i18next";
import { ThemeSwitcher } from "@/app/(main)/_components/sidebar/_components/nav-user/theme-switcher";
import { LocaleSelect } from "@/app/(main)/_components/sidebar/_components/nav-user/locale-select";
import { logout, useProfile } from "@/app/auth/_services";
import { LocalStorage } from "@/utils/storage";

export function NavUser() {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();
  const { data: user } = useProfile();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <LocaleSelect />

            <DropdownMenuSeparator />

            <ThemeSwitcher />

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut />
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
