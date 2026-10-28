import { m } from "@/paraglide/messages.js";
import { Check, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTableContext } from "@/components/data-table/table-context";

export function DataTableViewOptions() {
  const { table } = useTableContext();
  const isMobile = useIsMobile();

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide()),
    [table],
  );

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        <Settings2 />
        {m.table_view()}
      </PopoverTrigger>
      <PopoverContent align={isMobile ? "center" : "end"} className="w-44 p-0">
        <Command>
          <CommandInput placeholder={m.search()} />
          <CommandList>
            <CommandEmpty>{m.table_no_column_found()}</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => {
                return (
                  <CommandItem
                    className="cursor-pointer"
                    key={column.id}
                    onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                  >
                    <span className="grow truncate">
                      {column.columnDef.meta?.label ??
                        (typeof column.columnDef.header === "string" && column.columnDef.header?.toString())}
                    </span>
                    <Check
                      className={cn("ms-auto size-4 shrink-0", column.getIsVisible() ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
