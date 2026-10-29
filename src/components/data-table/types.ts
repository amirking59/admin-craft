import type { AnyFormApi } from "@tanstack/react-form";
import {
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from "@tanstack/react-table";

// Shared by DataTable (manual/server-side) and SimpleDataTable (client-side row models).
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  // The names `sortFn: "auto"` resolves to, as in v8.
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, datetime: sortFn_datetime },
});

export type DataTableFeatures = typeof dataTableFeatures;

export type FilterValue = string | string[];

export type FilterOption = { value: string; label: string; icon?: React.ReactNode };

/** The options a `useOptions` hook loaded. `remote`: the server matched them to the search already. */
export type FilterOptions = { items: FilterOption[]; loading: boolean; remote?: boolean };

/**
 * One filter of a DataTable. `type` says what it is, and the filter bar draws its editor:
 * - `select` / `multiselect`: one or several of `options` (or of what `useOptions` loads, for a list kept on the server), as a
 *   list with a search line, like Linear's.
 * - `date`: "+ Filter" offers "1 day ago" … "1 year ago" and "Custom…" (a dialog); the editor is a calendar. The
 *   value is the day's start as an ISO string, as from DateField.
 * - `dateRange`: "+ Filter" offers "Today", "Last 7 days" … and "Custom…"; the editor is a calendar where two clicks
 *   pick the first and last day. The value is "from..to" (see `parseRange`): the first day's start and the last
 *   day's end, as ISO strings.
 * - `text`: a text box. Pinned, it's the table's search box, with `label` as its placeholder.
 * - `number`: a range, "min..max" with either end empty ("100..", "..500"; see `parseRange`), with a "from" and a
 *   "to" box.
 * - `custom`: `input` draws the field.
 */
export type FilterDef = {
  name: string;
  /** The filter's name, on its chip and in "+ Filter". A message function, e.g. `m.orders_status`. */
  label: () => string;
  /** Always shown in the filter bar, applied as you type (e.g. a search box), instead of behind "+ Filter". */
  pinned?: boolean;
  /**
   * How the value reads on the chip. Defaults to the options' labels, the date, or the value(s) joined with commas.
   * For a `number` it formats one end of the range (e.g. `$1,250`).
   */
  formatValue?: (value: FilterValue) => string;
  /** Runs when this filter's value changes, with the form holding every filter (e.g. to clear a dependent one). */
  onValueChange?: (form: AnyFormApi) => void;
} & (
  | {
      type: "select" | "multiselect";
      /** The values to pick from: a function, so labels follow the language. */
      options: () => FilterOption[];
    }
  | {
      type: "select" | "multiselect";
      /**
       * For a list kept on the server, instead of `options`: a hook (e.g. `useCustomerOptions` from the feature's
       * services) giving the options for what's typed in the search line ("" before anything is), called again after a
       * pause as that changes. The chip names a picked value by the label it was loaded with; on a link opened fresh,
       * nothing is loaded yet, so it shows the value itself unless `formatValue` says otherwise.
       */
      useOptions: (search: string) => FilterOptions;
    }
  | { type: "date" | "dateRange" | "text" | "number" }
  | {
      type: "custom";
      /** The filter's field. It reads its name and value from the form's field context. */
      input: () => React.ReactNode;
    }
);

export type TableQueryFnResponse<T> = Promise<{
  items: T[];
  total: number;
}>;

export type DataTableFilters = Record<string, FilterValue>;

export type DataTableQueryParams = {
  page: { index: number; size: number };
  sort?: string;
  filters?: DataTableFilters;
};
