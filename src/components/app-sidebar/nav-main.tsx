import { m } from "@/paraglide/messages.js";
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
import { ForwardRefExoticComponent, RefAttributes } from "react";
import type { FileRouteTypes } from "@/routeTree.gen";

type Icon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
type Route = FileRouteTypes["to"];

// Labels are message functions, called at render time, so they follow the current language.
interface NavItem {
  label: () => string;
  icon: Icon;
  route?: Route;
  subItems?: {
    label: () => string;
    icon?: Icon;
    route: Route;
  }[];
}

export const navItems: NavItem[] = [
  {
    icon: Package,
    label: m.products_title,
    route: "/products",
  },
  {
    icon: ShoppingCart,
    label: m.orders_title,
    route: "/orders",
  },
];

export function NavMain() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const { setOpenMobile } = useSidebar();

  const closeMobile = () => setOpenMobile(false);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{m.navigation()}</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => {
          const label = item.label();

          if (item.subItems?.length) {
            return (
              <Collapsible
                key={label}
                render={<SidebarMenuItem />}
                defaultOpen={item.subItems.some((subItem) => pathname.startsWith(subItem.route))}
                className="group/collapsible"
              >
                <CollapsibleTrigger render={<SidebarMenuButton tooltip={label} />}>
                  <item.icon />
                  <span>{label}</span>
                  <ChevronRight className="ms-auto transition-transform duration-200 group-data-[open]/collapsible:rotate-90 rtl:rotate-180 rtl:group-data-[open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.route}>
                        <SidebarMenuSubButton
                          isActive={pathname.startsWith(subItem.route)}
                          render={<Link onClick={closeMobile} to={subItem.route} />}
                        >
                          <span>{subItem.label()}</span>
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
