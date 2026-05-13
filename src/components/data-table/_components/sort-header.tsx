import { Button } from "@/components/ui/button";
import { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsLeftRightIcon } from "lucide-react";
import { HTMLAttributes } from "react";

interface DataTableSortHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
}

export const DataTableSortHeader = <TData, TValue>({ column, children }: DataTableSortHeaderProps<TData, TValue>) => {
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
