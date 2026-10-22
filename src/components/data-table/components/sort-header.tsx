import { Button } from "@/components/ui/button";
import { Column, RowData } from "@tanstack/react-table";
import { DataTableFeatures } from "@/components/data-table/types";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";

interface DataTableSortHeaderProps<TData extends RowData, TValue> {
  column: Column<DataTableFeatures, TData, TValue>;
  children: React.ReactNode;
}

/** Value for the header cell's `aria-sort`; undefined when the column can't be sorted. */
export const getAriaSort = <TData extends RowData, TValue>(column: Column<DataTableFeatures, TData, TValue>) => {
  if (!column.getCanSort()) return undefined;
  const sort = column.getIsSorted();
  return sort === "asc" ? "ascending" : sort === "desc" ? "descending" : "none";
};

export const DataTableSortHeader = <TData extends RowData, TValue>({
  column,
  children,
}: DataTableSortHeaderProps<TData, TValue>) => {
  if (!column.getCanSort()) return children;

  const sort = column.getIsSorted();
  const SortIcon = sort === "desc" ? ArrowDownIcon : sort === "asc" ? ArrowUpIcon : ChevronsUpDownIcon;

  return (
    <Button variant="ghost" size="sm" className="-ms-2.5" onClick={column.getToggleSortingHandler()}>
      {children}
      <SortIcon className="size-3" />
    </Button>
  );
};
