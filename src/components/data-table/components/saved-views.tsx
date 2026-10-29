import { m } from "@/paraglide/messages.js";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { Check, X } from "lucide-react";
import { useTableContext } from "@/components/data-table/table-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SavedView {
  name: string;
  filters: ColumnFiltersState;
  sorting: SortingState;
}

const sameState = (a: Omit<SavedView, "name">, b: Omit<SavedView, "name">) =>
  JSON.stringify([a.filters, a.sorting]) === JSON.stringify([b.filters, b.sorting]);

/**
 * The table's saved views: its filters and sort under a name, kept in this browser per table (`meta.id`), and the
 * one that's on, if any. Null for a table without an id.
 */
export function useSavedViews() {
  const { table } = useTableContext();
  const id = table.options.meta?.id;
  const [views, setViews] = useLocalStorage<SavedView[]>(`table:${id}:views`, []);

  if (!id) return null;
  const current = { filters: table.state.columnFilters, sorting: table.state.sorting };
  return { views, setViews, current, active: views.find((view) => sameState(view, current)) };
}

/** The saved views, one click each to apply, × to forget; then a name to save the current filters and sort under. */
export function SavedViews({ views, setViews, current, active }: NonNullable<ReturnType<typeof useSavedViews>>) {
  const { table } = useTableContext();
  const [name, setName] = useState("");

  // Under a taken name, replaces that view.
  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setViews((list) => [...list.filter((view) => view.name !== trimmed), { name: trimmed, ...current }]);
    setName("");
  };

  return (
    <>
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
        className="mt-1 flex gap-1"
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
    </>
  );
}
