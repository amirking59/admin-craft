import { ChevronRight, LucideProps, ShoppingCart, Package } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
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
import { cn } from "@/lib/utils";
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

export function NavMain() {
  const { t } = useTranslation();
  const pathname = useLocation({ select: (location) => location.pathname });
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => {
          if (item.subItems && item.subItems.length !== 0) {
            return (
              <Collapsible
                key={t(item.title, { ns: item.namespace })}
                render={<SidebarMenuItem />}
                defaultOpen={item.subItems?.some((subItem) => pathname?.startsWith(subItem.route))}
                className="group/collapsible"
              >
                <CollapsibleTrigger render={<SidebarMenuButton tooltip={t(item.title, { ns: item.namespace })} />}>
                  {item.icon && <item.icon />}
                  <span>{t(item.title, { ns: item.namespace })}</span>
                  <ChevronRight className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.subItems?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          isActive={pathname?.startsWith(subItem.route)}
                          render={<Link onClick={() => setOpenMobile(false)} to={subItem.route} />}
                        >
                          <span>{t(subItem.title, { ns: subItem.namespace })}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
                =
              </Collapsible>
            );
          }

          if (item.route) {
            return (
              <Link onClick={() => setOpenMobile(false)} key={item.route} to={item.route}>
                <SidebarMenuButton
                  isActive={pathname?.startsWith(item.route)}
                  tooltip={t(item.title, { ns: item.namespace })}
                >
                  {item.icon && <item.icon />}
                  <span>{t(item.title, { ns: item.namespace })}</span>
                </SidebarMenuButton>
              </Link>
            );
          }

          return null;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
