import { ColumnDef, ColumnFiltersState, RowData } from "@tanstack/react-table";
import dayjs from "dayjs";
import { m } from "@/paraglide/messages.js";
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

// The first day's start to the last day's end.
const range = (from: dayjs.Dayjs, to: dayjs.Dayjs) =>
  toRange(from.startOf("day").toISOString(), to.endOf("day").toISOString());

/**
 * "Today" … "This year", offered by a date range filter in "+ Filter": "from..to", the first day's start to the last
 * day's end. Like datePresets, the URL keeps the dates, so a shared link shows the same rows later.
 */
export const dateRangePresets = (): FilterOption[] => {
  const today = dayjs();
  const lastMonth = today.subtract(1, "month");
  return [
    { label: m.table_today(), value: range(today, today) },
    { label: m.table_last_7_days(), value: range(today.subtract(6, "day"), today) },
    { label: m.table_last_30_days(), value: range(today.subtract(29, "day"), today) },
    { label: m.table_this_month(), value: range(today.startOf("month"), today) },
    { label: m.table_last_month(), value: range(lastMonth.startOf("month"), lastMonth.endOf("month")) },
    { label: m.table_this_year(), value: range(today.startOf("year"), today) },
  ];
};

/** A range filter's "from..to" value as its two ends, "" where open: "100.." → ["100", ""]. */
export const parseRange = (value: unknown): [string, string] => {
  const [from = "", to = ""] = String(value ?? "").split("..");
  return [from, to];
};

/** The reverse of parseRange: "" when both ends are open, so the filter goes away. */
export const toRange = (from: string, to: string) => (from || to ? `${from}..${to}` : "");
