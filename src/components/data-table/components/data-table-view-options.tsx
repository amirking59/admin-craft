import { m } from "@/paraglide/messages.js";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTableContext } from "@/components/data-table/table-context";

/** "View": a checkbox per column that can be hidden. The menu stays open, so several columns can be toggled. */
export function DataTableViewOptions() {
  const { table } = useTableContext();

  const columns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide());
  const allVisible = columns.every((column) => column.getIsVisible());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <Settings2 />
        {m.table_view()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => column.toggleVisibility(checked)}
              closeOnClick={false}
            >
              <span className="truncate">
                {column.columnDef.meta?.label ??
                  (typeof column.columnDef.header === "string" ? column.columnDef.header : column.id)}
              </span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={allVisible}
          closeOnClick={false}
          onClick={() => columns.forEach((column) => column.toggleVisibility(true))}
        >
          {m.table_show_all()}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
