import { m } from "@/paraglide/messages.js";
import { Fragment } from "react";
import { Link, useMatches } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { CommandMenu } from "@/components/command-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

/** Where the page is: Home, then each route with a `staticData.title`, the last one being this page. */
function Breadcrumbs() {
  const pages = useMatches().filter((match) => match.staticData.title);
  const linkClassName = "transition-colors hover:text-foreground";

  return (
    <nav aria-label={m.breadcrumbs()} className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          {pages.length ? (
            <Link to="/" className={linkClassName}>
              {m.home()}
            </Link>
          ) : (
            <span aria-current="page" className="font-medium text-foreground">
              {m.home()}
            </span>
          )}
        </li>
        {pages.map((page, index) => (
          <Fragment key={page.id}>
            <li aria-hidden>
              <ChevronRight className="size-3.5 rtl:rotate-180" />
            </li>
            <li className="truncate">
              {index === pages.length - 1 ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {page.staticData.title?.()}
                </span>
              ) : (
                <Link to={page.pathname} className={linkClassName}>
                  {page.staticData.title?.()}
                </Link>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}

/** The bar above every page: the sidebar toggle, the breadcrumbs, and the command menu's search box. */
export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <SidebarTrigger className="-ms-1" />
      {/* `self-auto`: centred like the rest of the bar, not stretched (from the top) to its 16px. */}
      <Separator orientation="vertical" className="me-2 data-vertical:h-4 data-vertical:self-auto" />
      <Breadcrumbs />
      <div className="flex-1" />
      <CommandMenu />
    </header>
  );
}
