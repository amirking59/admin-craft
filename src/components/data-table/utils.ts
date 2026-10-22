import { ColumnDef, ColumnFiltersState, RowData } from "@tanstack/react-table";
import { DataTableFeatures, DataTableFilters } from "@/components/data-table/types";

/** Hides columns marked `meta.initialHidden` on first render. */
export const getInitialColumnVisibility = <TData extends RowData>(columns: ColumnDef<DataTableFeatures, TData>[]) =>
  Object.fromEntries(
    columns.filter((column) => column.meta?.initialHidden && column.id).map((column) => [column.id!, false]),
  );

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
