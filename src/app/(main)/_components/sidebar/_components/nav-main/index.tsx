"use client";

import { ChevronRight, FileSearch, LucideProps, CircleDollarSign, Wallet, ChartNoAxesCombined } from "lucide-react";

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
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { cn } from "@/utils/cn";

type Icon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

interface NavItem {
  title: string;
  namespace: string;
  icon: Icon;
  route?: string;
  subItems?: {
    namespace: string;
    icon?: Icon;
    title: string;
    route: string;
  }[];
}

export const navItems: NavItem[] = [
  {
    title: "walletsManagement",
    namespace: "base",
    icon: Wallet,
    subItems: [
      {
        title: "coins",
        namespace: "coins",
        route: "/coins",
      },
      {
        title: "networks",
        namespace: "networks",
        route: "/networks",
      },
      {
        title: "hotWallets",
        namespace: "hotWallets",
        route: "/hot-wallets",
      },
      {
        title: "priceInquirySources",
        namespace: "priceInquiry",
        route: "/price-inquiry",
      },
    ],
  },
  {
    title: "marketingManagement",
    namespace: "base",
    icon: ChartNoAxesCombined,
    subItems: [
      {
        title: "campaigns",
        namespace: "campaigns",
        route: "/campaigns",
      },
      {
        title: "giftCards",
        namespace: "giftCards",
        route: "/gift-cards",
      },
      {
        title: "referral",
        namespace: "referral",
        route: "/referrals",
      },
    ],
  },
  {
    title: "financialManagement",
    namespace: "financialManagement",
    icon: CircleDollarSign,
    subItems: [
      {
        title: "bankReceiptDeposit",
        namespace: "financialManagement",
        route: "/financial/bank-receipt-deposit",
      },
      {
        title: "blockchainWithdrawal",
        namespace: "financialManagement",
        route: "/financial/blockchain-withdrawal",
      },
      {
        title: "bankAccounts",
        namespace: "financialManagement",
        route: "/financial/bank-accounts",
      },
      {
        title: "jibitWithdrawal",
        namespace: "financialManagement",
        route: "/financial/jibit-withdrawal",
      },
    ],
  },
  {
    title: "documentReviews",
    namespace: "documentReviews",
    icon: FileSearch,
    route: "/document-reviews",
  },
];

export function NavMain() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { setOpenMobile, state, isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => {
          if (item.subItems && item.subItems.length !== 0) {
            return (
              <Collapsible
                key={t(item.title, { ns: item.namespace })}
                asChild
                defaultOpen={item.subItems?.some((subItem) => pathname?.startsWith(subItem.route))}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={t(item.title, { ns: item.namespace })}>
                      {item.icon && (
                        <item.icon
                          className={cn("transition-all", {
                            "size-5!": state === "expanded" || isMobile,
                          })}
                        />
                      )}
                      <span>{t(item.title, { ns: item.namespace })}</span>
                      <ChevronRight className="ms-auto rtl:rotate-180 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton isActive={pathname?.startsWith(subItem.route)} asChild>
                            <Link onClick={() => setOpenMobile(false)} href={subItem.route}>
                              <span>{t(subItem.title, { ns: subItem.namespace })}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          if (item.route) {
            return (
              <Link onClick={() => setOpenMobile(false)} key={item.route} href={item.route}>
                <SidebarMenuButton
                  isActive={pathname?.startsWith(item.route)}
                  tooltip={t(item.title, { ns: item.namespace })}
                >
                  {item.icon && (
                    <item.icon
                      className={cn("transition-all", {
                        "size-5!": state === "expanded" || isMobile,
                      })}
                    />
                  )}
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
