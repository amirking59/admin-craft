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

export interface PaginatedQueryFnParams {
  limit: number;
  skip: number;
  sort?: {
    field: string;
    operator: "asc" | "des";
  }[];
  query?: {
    field: string | string[];
    operator: FilterOperator;
    value: string | number | boolean | string[] | number[];
  }[];
  [key: string]: any;
}

export enum TableViewType {
  LIST = "list",
  GRID = "grid",
}

export enum FilterOperator {
  Like = "lk",
  Equal = "eq",
  BetweenDate = "btd",
}

export type FilterDef = {
  input?: () => React.ReactNode;
  name: string;
  operator: FilterOperator;
  defaultValue?: string;
  transformValue?: (value: string) => number | boolean | string[] | number[];
  onValueChange?: (form: AnyFormApi) => void;
};

export type TableQueryFnResponse<T> = Promise<{
  items: T[];
  total: number;
}>;

export type DataTableFilters = Record<string, string | string[]>;

export type DataTableQueryParams = {
  page: { index: number; size: number };
  sort?: string;
  filters?: DataTableFilters;
};
