"use client";

import { ChevronsUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

import { useTranslation } from "react-i18next";
import { ThemeSwitcher } from "@/app/(main)/_components/sidebar/_components/nav-user/theme-switcher";
import { LocaleSelect } from "@/app/(main)/_components/sidebar/_components/nav-user/locale-select";
import { Skeleton } from "@/components/ui/skeleton";

export function NavUser() {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();

  const user = { name: "John Doe" }; // Replace with actual user fetching logic

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
                {!user ? (
                  <Skeleton className="h-[17.5px] w-36" />
                ) : (
                  <span className="truncate font-medium">{user?.name}</span>
                )}
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
            {/* <DropdownMenuItem
              disabled={logoutMutation?.isPending}
              className="cursor-pointer"
              onClick={() => {
                logoutMutation.mutate(undefined, {
                  onSuccess: () => console.log(t("logoutSuccessfully")),
                });
              }}
            >
              <LogOut />
              {t("logout")}
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
