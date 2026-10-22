import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Cell, RowData } from "@tanstack/react-table";
import { DataTableFeatures } from "@/components/data-table/_types";

interface CellTooltipProps<TData extends RowData, TValue> {
  children: React.ReactNode;
  cell?: Cell<DataTableFeatures, TData, TValue>;
}

export function CellTooltip<TData extends RowData, TValue>({ children, cell }: CellTooltipProps<TData, TValue>) {
  const tooltipMeta = cell?.column.columnDef.meta?.tooltip;

  if (!tooltipMeta) return children;

  return (
    <Tooltip>
      <TooltipTrigger render={<div className="w-fit" />}>{children}</TooltipTrigger>
      <TooltipContent>{typeof tooltipMeta === "string" ? tooltipMeta : tooltipMeta(cell.getContext())}</TooltipContent>
    </Tooltip>
  );
}
