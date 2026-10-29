import { useLocalStorage } from "usehooks-ts";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { useTableContext } from "@/components/data-table/table-context";

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
