import { m } from "@/paraglide/messages.js";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SavedViews, useSavedViews } from "@/components/data-table/components/saved-views";
import { useTableContext } from "@/components/data-table/table-context";

const headingClassName = "px-2 py-1.5 text-xs font-medium text-muted-foreground";

/**
 * "View", like Linear's display options: the table's saved views (a DataTable's only, see SavedViews), then a
 * checkbox per column that can be hidden.
 */
export function DataTableViewOptions() {
  const { table } = useTableContext();
  const savedViews = useSavedViews();

  const columns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide());
  const allVisible = columns.every((column) => column.getIsVisible());
  const viewName = savedViews?.active?.name;

  return (
    <Popover>
      {/* Just the icon, named by its tooltip, until a saved view is on: then the view's name too. */}
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  variant="outline"
                  size={viewName ? "sm" : "icon-sm"}
                  aria-label={viewName ? undefined : m.table_view()}
                  className="max-w-48"
                />
              }
            />
          }
        >
          <SlidersHorizontal />
          {viewName && <span className="truncate">{viewName}</span>}
        </TooltipTrigger>
        <TooltipContent>{m.table_view()}</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-72 gap-0 p-0">
        {savedViews && (
          <section className="border-b p-1">
            <h3 className={headingClassName}>{m.table_views()}</h3>
            <SavedViews {...savedViews} />
          </section>
        )}

        <section className="p-1">
          <h3 className={headingClassName}>{m.table_columns()}</h3>
          {columns.map((column) => (
            <label
              key={column.id}
              className="flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            >
              <Checkbox
                checked={column.getIsVisible()}
                onCheckedChange={(checked) => column.toggleVisibility(checked)}
              />
              <span className="truncate">
                {column.columnDef.meta?.label ??
                  (typeof column.columnDef.header === "string" ? column.columnDef.header : column.id)}
              </span>
            </label>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start font-normal"
            disabled={allVisible}
            onClick={() => columns.forEach((column) => column.toggleVisibility(true))}
          >
            {m.table_show_all()}
          </Button>
        </section>
      </PopoverContent>
    </Popover>
  );
}
