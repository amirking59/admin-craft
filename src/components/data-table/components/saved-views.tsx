import { m } from "@/paraglide/messages.js";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Bookmark, Check, X } from "lucide-react";
import { useTableContext } from "@/components/data-table/table-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SavedView {
  name: string;
  filters: ColumnFiltersState;
  sorting: SortingState;
}

const sameState = (a: Omit<SavedView, "name">, b: Omit<SavedView, "name">) =>
  JSON.stringify([a.filters, a.sorting]) === JSON.stringify([b.filters, b.sorting]);

/**
 * "Views": the table's filters and sort, saved under a name in this browser, to come back to in one click. The button
 * names the view that's on, if any. Saving under a taken name replaces that view.
 */
export function SavedViews({ className }: { className?: string }) {
  const { table } = useTableContext();
  const [views, setViews] = useLocalStorage<SavedView[]>(`table:${table.options.meta?.id}:views`, []);
  const [name, setName] = useState("");

  const current = { filters: table.state.columnFilters, sorting: table.state.sorting };
  const active = views.find((view) => sameState(view, current));

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setViews((list) => [...list.filter((view) => view.name !== trimmed), { name: trimmed, ...current }]);
    setName("");
  };

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="ghost" size="sm" className={cn("max-w-48", className)} />}>
        <Bookmark />
        <span className="truncate">{active?.name ?? m.table_views()}</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 gap-1 p-1">
        {views.length === 0 ? (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">{m.table_no_views()}</p>
        ) : (
          views.map((view) => (
            <div key={view.name} className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="min-w-0 flex-1 justify-start font-normal"
                onClick={() => {
                  table.setSorting(view.sorting);
                  table.setColumnFilters(view.filters);
                }}
              >
                <Check className={cn(view !== active && "invisible")} />
                <span className="truncate">{view.name}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={m.remove_x({ x: view.name })}
                className="text-muted-foreground"
                onClick={() => setViews((list) => list.filter((other) => other.name !== view.name))}
              >
                <X />
              </Button>
            </div>
          ))
        )}

        <form
          className="flex gap-1 border-t pt-1"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <Input
            aria-label={m.table_view_name()}
            placeholder={m.table_view_name()}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-8"
          />
          <Button type="submit" size="sm" disabled={!name.trim()}>
            {m.table_save_view()}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
