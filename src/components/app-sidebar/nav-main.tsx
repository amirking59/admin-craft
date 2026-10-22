import { ChevronRight, LucideProps, ShoppingCart, Package } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import type { FileRouteTypes } from "@/routeTree.gen";

type Icon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
type Route = FileRouteTypes["to"];

interface NavItem {
  title: string;
  namespace: string;
  icon: Icon;
  route?: Route;
  subItems?: {
    namespace: string;
    icon?: Icon;
    title: string;
    route: Route;
  }[];
}

export const navItems: NavItem[] = [
  {
    icon: Package,
    namespace: "products",
    title: "products",
    route: "/products",
  },
  {
    icon: ShoppingCart,
    namespace: "orders",
    title: "orders",
    route: "/orders",
  },
];

// 40px rows, muted until hover; the active route gets a soft primary tint. Icon mode keeps the sidebar's 32px squares.
const navButtonClassName =
  "h-10 gap-3 px-3 text-muted-foreground hover:text-foreground [&>svg]:size-[18px] data-active:bg-primary/10 data-active:font-medium data-active:text-primary data-active:hover:bg-primary/15";

export function NavMain() {
  const { t } = useTranslation();
  const pathname = useLocation({ select: (location) => location.pathname });
  const { setOpenMobile } = useSidebar();

  const closeMobile = () => setOpenMobile(false);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("navigation")}</SidebarGroupLabel>
      <SidebarMenu className="gap-1">
        {navItems.map((item) => {
          const label = t(item.title, { ns: item.namespace });

          if (item.subItems?.length) {
            return (
              <Collapsible
                key={item.title}
                render={<SidebarMenuItem />}
                defaultOpen={item.subItems.some((subItem) => pathname.startsWith(subItem.route))}
                className="group/collapsible"
              >
                <CollapsibleTrigger render={<SidebarMenuButton tooltip={label} className={navButtonClassName} />}>
                  <item.icon />
                  <span>{label}</span>
                  <ChevronRight className="ms-auto transition-transform duration-200 group-data-[open]/collapsible:rotate-90 rtl:rotate-180 rtl:group-data-[open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          isActive={pathname.startsWith(subItem.route)}
                          render={<Link onClick={closeMobile} to={subItem.route} />}
                        >
                          <span>{t(subItem.title, { ns: subItem.namespace })}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            );
          }

          if (!item.route) return null;

          return (
            <SidebarMenuItem key={item.route}>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.route)}
                tooltip={label}
                className={navButtonClassName}
                render={<Link onClick={closeMobile} to={item.route} />}
              >
                <item.icon />
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
