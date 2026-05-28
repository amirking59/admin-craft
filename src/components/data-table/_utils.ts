import { ColumnFiltersState } from "@tanstack/react-table";
import { DataTableFilters } from "@/components/data-table/_types";

export const isFilterValueEmpty = (value: unknown) => {
  if (value == null) return true;

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  return false;
};

export const filtersArrayToObject = (columnFilters: ColumnFiltersState): DataTableFilters =>
  columnFilters.reduce((acc, { id, value }) => {
    if (!isFilterValueEmpty(value)) {
      acc[id] = value as string | string[];
    }
    return acc;
  }, {} as DataTableFilters);

export const filtersObjectToArray = (filters: DataTableFilters): ColumnFiltersState =>
  Object.entries(filters)
    .filter(([, value]) => !isFilterValueEmpty(value))
    .map(([id, value]) => ({ id, value }));
