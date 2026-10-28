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

export enum FilterOperator {
  Like = "lk",
  Equal = "eq",
  BetweenDate = "btd",
}

export type FilterValue = string | string[];

export type FilterDef = {
  name: string;
  /** The filter's name, on its chip and in the "add filter" menu. A message function, e.g. `m.orders_status`. */
  label: () => string;
  /** The filter's field; it reads its name and value from the form's field context. */
  input?: () => React.ReactNode;
  /** How the value reads on the chip. Defaults to the value, or the values joined with commas. */
  formatValue?: (value: FilterValue) => string;
  /** Always shown in the filter bar, applied as you type (e.g. a search box), instead of behind "+ Filter". */
  pinned?: boolean;
  operator: FilterOperator;
  /** Runs when this filter's value changes, with the form holding every filter (e.g. to clear a dependent one). */
  onValueChange?: (form: AnyFormApi) => void;
};

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
