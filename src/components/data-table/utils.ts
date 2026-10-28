import { ColumnDef, ColumnFiltersState, RowData } from "@tanstack/react-table";
import dayjs from "dayjs";
import { getLocale } from "@/paraglide/runtime.js";
import { DataTableFeatures, DataTableFilters, FilterOption } from "@/components/data-table/types";

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

/**
 * "1 day ago" … "1 year ago", offered by a date filter in "+ Filter": the start of that day, as an ISO string like DatePicker's.
 * The URL keeps that date, so a shared link shows the same rows later.
 */
export const datePresets = (): FilterOption[] => {
  const relative = new Intl.RelativeTimeFormat(getLocale(), { numeric: "always" });
  const presets = [
    [1, "day"],
    [3, "day"],
    [1, "week"],
    [1, "month"],
    [3, "month"],
    [6, "month"],
    [1, "year"],
  ] as const;
  return presets.map(([amount, unit]) => ({
    value: dayjs().subtract(amount, unit).startOf("day").toISOString(),
    label: relative.format(-amount, unit),
  }));
};
