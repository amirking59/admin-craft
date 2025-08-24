import { UseFormReturn } from "react-hook-form";

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
  onValueChange?: (form: UseFormReturn<Record<string, string>, any, Record<string, string>>) => void;
};
