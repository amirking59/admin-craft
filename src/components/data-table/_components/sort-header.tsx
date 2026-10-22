import { Button } from "@/components/ui/button";
import { Column, RowData } from "@tanstack/react-table";
import { DataTableFeatures } from "@/components/data-table/_types";
import { ArrowDownIcon, ArrowUpIcon, ChevronsLeftRightIcon } from "lucide-react";
import { HTMLAttributes } from "react";

interface DataTableSortHeaderProps<TData extends RowData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<DataTableFeatures, TData, TValue>;
}

export const DataTableSortHeader = <TData extends RowData, TValue>({
  column,
  children,
}: DataTableSortHeaderProps<TData, TValue>) => {
  const renderSortIcon = () => {
    const sort = column.getIsSorted();
    if (!sort) {
      return <ChevronsLeftRightIcon className="size-3 rotate-90" />;
    }
    return sort === "desc" ? <ArrowDownIcon className="size-3" /> : <ArrowUpIcon className="size-3" />;
  };

  if (!column.getCanSort()) {
    return <div>{children}</div>;
  }

  return (
    <div onClick={column.getToggleSortingHandler()} className="flex gap-2 items-center cursor-pointer">
      <div>{children}</div>
      <Button variant="ghost" size="icon-xs">
        {renderSortIcon()}
      </Button>
    </div>
  );
};
