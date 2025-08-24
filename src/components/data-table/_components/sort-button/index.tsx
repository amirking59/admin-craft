"use client";

import { ArrowDownIcon, ArrowUpIcon, ChevronsLeftRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useTableContext } from "@/components/data-table/_context/table";

export function SortButton() {
  const { table } = useTableContext();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const columns = React.useMemo(() => table.getAllColumns().filter((column) => column.getCanSort()), [table]);

  if (columns.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <ChevronsLeftRightIcon className="rotate-90" />
          {t("table.sort")}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={isMobile ? "center" : "end"} className="w-44 p-0">
        <Command>
          <CommandInput placeholder={t("search")} />
          <CommandList>
            <CommandEmpty>{t("table.noColumnFound")}</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => {
                const renderSortIcon = () => {
                  const sort = column.getIsSorted();
                  if (!sort) {
                    return <ChevronsLeftRightIcon className="size-4 shrink-0 rotate-90" />;
                  }
                  return sort === "desc" ? (
                    <ArrowDownIcon className="size-4 shrink-0" />
                  ) : (
                    <ArrowUpIcon className="size-4 shrink-0" />
                  );
                };

                return (
                  <CommandItem className="cursor-pointer" key={column.id} onSelect={column.getToggleSortingHandler()}>
                    <span className="truncate grow">
                      {column.columnDef.meta?.label ??
                        (typeof column.columnDef.header === "string" && column.columnDef.header?.toString())}
                    </span>

                    {renderSortIcon()}
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
