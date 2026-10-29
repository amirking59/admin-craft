import { m } from "@/paraglide/messages.js";
import { useState } from "react";
import { BookmarkPlus, Check, ChevronLeft, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSavedViews } from "@/components/data-table/components/saved-views";
import { useTableContext } from "@/components/data-table/table-context";
import { cn } from "@/lib/utils";

// Module-level, so a re-render doesn't pull focus back to it.
const focusOnMount = (element: HTMLInputElement | null) => element?.focus();

/**
 * "View", like Linear's display options, as a menu: the table's saved views (a DataTable's only, see useSavedViews),
 * one click each to apply and × to forget, then "Save current view…"; then a checkbox per column that can be hidden.
 */
export function DataTableViewOptions() {
  const { table } = useTableContext();
  const savedViews = useSavedViews();
  // Naming a new view shows its form in place of the menu's items, which would take focus from it on hover.
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");

  const columns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide());
  const allVisible = columns.every((column) => column.getIsVisible());
  const viewName = savedViews?.active?.name;

  // Under a taken name, replaces that view.
  const save = () => {
    const trimmed = name.trim();
    if (!savedViews || !trimmed) return;
    savedViews.setViews((list) => [
      ...list.filter((view) => view.name !== trimmed),
      { name: trimmed, ...savedViews.current },
    ]);
    setName("");
    setNaming(false);
  };

  return (
    <DropdownMenu
      // Back to the items once closed, so it opens on them next time.
      onOpenChangeComplete={(open) => {
        if (open) return;
        setNaming(false);
        setName("");
      }}
    >
      {/* Just the icon, named by its tooltip, until a saved view is on: then the view's name too. */}
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size={viewName ? "sm" : "icon-sm"}
                  aria-label={viewName ? undefined : m.table_view()}
                  className="max-w-48"
                />
              }
            />
          }
        >
          <SlidersHorizontal />
          {viewName && <span className="truncate">{viewName}</span>}
        </TooltipTrigger>
        <TooltipContent>{m.table_view()}</TooltipContent>
      </Tooltip>
      {/* Stays where it opened: saving or applying a view changes the button's width (and moves the ones beside it). */}
      <DropdownMenuContent align="end" disableAnchorTracking className="w-64">
        {naming ? (
          // Keys belong to the name field, not the menu (typing would jump through its items); Escape still closes it.
          <form
            className="flex flex-col gap-2 p-1"
            onKeyDown={(event) => event.key !== "Escape" && event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={m.table_back()}
                onClick={() => setNaming(false)}
              >
                <ChevronLeft className="rtl:rotate-180" />
              </Button>
              <Input
                ref={focusOnMount}
                aria-label={m.table_view_name()}
                placeholder={m.table_view_name()}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-8"
              />
            </div>
            <Button type="submit" size="sm" disabled={!name.trim()}>
              {m.table_save_view()}
            </Button>
          </form>
        ) : (
          <>
            {savedViews && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{m.table_views()}</DropdownMenuLabel>
                  {savedViews.views.map((view) => (
                    <DropdownMenuItem
                      key={view.name}
                      onClick={() => {
                        table.setSorting(view.sorting);
                        table.setColumnFilters(view.filters);
                      }}
                    >
                      <Check className={cn(view !== savedViews.active && "invisible")} />
                      <span className="grow truncate">{view.name}</span>
                      <button
                        type="button"
                        aria-label={m.remove_x({ x: view.name })}
                        className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
                        onClick={(event) => {
                          event.stopPropagation();
                          savedViews.setViews((list) => list.filter((other) => other.name !== view.name));
                        }}
                      >
                        <X className="size-3.5" />
                      </button>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem closeOnClick={false} onClick={() => setNaming(true)}>
                    <BookmarkPlus />
                    {m.table_save_current_view()}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuGroup>
              <DropdownMenuLabel>{m.table_columns()}</DropdownMenuLabel>
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked) => column.toggleVisibility(checked)}
                >
                  <span className="truncate">
                    {column.columnDef.meta?.label ??
                      (typeof column.columnDef.header === "string" ? column.columnDef.header : column.id)}
                  </span>
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuItem
                closeOnClick={false}
                disabled={allVisible}
                onClick={() => columns.forEach((column) => column.toggleVisibility(true))}
              >
                {m.table_show_all()}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
