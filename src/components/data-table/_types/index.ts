import type { AnyFormApi } from "@tanstack/react-form";

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
