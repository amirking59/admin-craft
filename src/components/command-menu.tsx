import { m } from "@/paraglide/messages.js";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { House, Languages, LogOut, Moon, Search, Sun } from "lucide-react";
import { getLocale, locales, setLocale } from "@/paraglide/runtime.js";
import { navItems } from "@/components/app-sidebar/nav-main";
import { localeLabels } from "@/components/app-sidebar/nav-user/locale-select";
import { logout } from "@/features/auth/services";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent);
const shortcut = isMac ? "⌘K" : "Ctrl K";

// The sidebar's pages, its groups' pages flattened in.
const pages = navItems.flatMap((item) => [
  ...(item.route ? [{ label: item.label, icon: item.icon, route: item.route }] : []),
  ...(item.subItems ?? []).map((sub) => ({ label: sub.label, icon: sub.icon ?? item.icon, route: sub.route })),
]);

/**
 * The search box in the header, and the command palette it opens (also with Ctrl+K, or ⌘K on a Mac): go to a page,
 * search the orders for what's typed, switch the theme or language, log out.
 */
export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const query = search.trim();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Closes the palette (and clears its search line), then runs the command.
  const run = (command: () => void) => {
    setOpen(false);
    setSearch("");
    command();
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        aria-label={m.search()}
        className="text-muted-foreground md:w-56 md:justify-start"
        onClick={() => setOpen(true)}
      >
        <Search />
        <span className="hidden flex-1 text-start md:inline">{m.search()}…</span>
        <kbd className="hidden rounded border bg-muted px-1.5 font-sans text-xs md:inline">{shortcut}</kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen} title={m.command_title()} description={m.command_placeholder()}>
        <Command>
          <CommandInput placeholder={m.command_placeholder()} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>{m.no_items_found()}</CommandEmpty>

            {query && (
              <CommandGroup heading={m.orders_title()}>
                {/* Its value holds what's typed, so it always matches. */}
                <CommandItem
                  value={`search-orders ${query}`}
                  onSelect={() => run(() => navigate({ to: "/orders", search: { filters: { q: query } } }))}
                >
                  <Search />
                  {m.search_orders_for({ x: query })}
                </CommandItem>
              </CommandGroup>
            )}

            <CommandGroup heading={m.navigation()}>
              <CommandItem onSelect={() => run(() => navigate({ to: "/" }))}>
                <House />
                {m.home()}
              </CommandItem>
              {pages.map((page) => (
                <CommandItem key={page.route} onSelect={() => run(() => navigate({ to: page.route }))}>
                  <page.icon />
                  {page.label()}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading={m.preferences()}>
              <CommandItem onSelect={() => run(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}>
                {resolvedTheme === "dark" ? <Sun /> : <Moon />}
                {resolvedTheme === "dark" ? m.light() : m.dark()}
              </CommandItem>
              {locales
                .filter((locale) => locale !== getLocale())
                .map((locale) => (
                  <CommandItem key={locale} onSelect={() => run(() => setLocale(locale))}>
                    <Languages />
                    {localeLabels[locale]}
                  </CommandItem>
                ))}
              <CommandItem onSelect={() => run(logout)}>
                <LogOut />
                {m.logout()}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
