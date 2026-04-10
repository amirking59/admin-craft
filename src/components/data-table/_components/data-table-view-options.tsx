"use client";

import { Check, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useTableContext } from "@/components/data-table/_context/table";

export function DataTableViewOptions() {
  const { table } = useTableContext();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide()),
    [table],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Settings2 />
          {t("table.view")}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={isMobile ? "center" : "end"} className="w-44 p-0">
        <Command>
          <CommandInput placeholder={t("search")} />
          <CommandList>
            <CommandEmpty>{t("table.noColumnFound")}</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => {
                return (
                  <CommandItem
                    className="cursor-pointer"
                    key={column.id}
                    onSelect={() => column.toggleVisibility(!column.getIsVisible())}
                  >
                    <span className="truncate grow">
                      {column.columnDef.meta?.label ??
                        (typeof column.columnDef.header === "string" && column.columnDef.header?.toString())}
                    </span>
                    <Check
                      className={cn("ml-auto size-4 shrink-0", column.getIsVisible() ? "opacity-100" : "opacity-0")}
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
