import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Cell } from "@tanstack/react-table";

interface CellTooltipProps<TData, TValue> {
  children: React.ReactNode;
  cell?: Cell<TData, TValue>;
}

export function CellTooltip<TData, TValue>({ children, cell }: CellTooltipProps<TData, TValue>) {
  const tooltipMeta = cell?.column.columnDef.meta?.tooltip;

  if (!tooltipMeta) return children;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="w-fit">{children}</div>
      </TooltipTrigger>
      <TooltipContent>{typeof tooltipMeta === "string" ? tooltipMeta : tooltipMeta(cell.getContext())}</TooltipContent>
    </Tooltip>
  );
}
