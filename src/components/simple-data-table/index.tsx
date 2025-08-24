"use client";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableActions } from "@/components/data-table/_components/data-table-actions";
import { Pagination } from "@/components/data-table/_components/pagination";
import { DataTableViewOptions } from "@/components/data-table/_components/data-table-view-options";
import { TableView } from "@/components/data-table/_components/table-view";
import { TableProvider } from "@/components/data-table/_context/table";
import { SortButton } from "@/components/data-table/_components/sort-button";
import { TableViewType } from "@/components/data-table/_types";
import { GridView } from "@/components/data-table/_components/grid-view";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { LayoutGrid, TableProperties } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initialSort?: SortingState[0];
  title?: string;
  actions?: React.ReactNode[];
  data: TData[];
  hasPagination?: boolean;
  rowHeight?: number;
  defaultViewType?: TableViewType;
  id?: string;
  isLoading?: boolean;
}

export function SimpleDataTable<TData, TValue>({
  columns,
  initialSort,
  title,
  actions = [],
  data = [],
  hasPagination = false,
  rowHeight = 61,
  defaultViewType = TableViewType.LIST,
  id,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [viewType, setViewType] = useQueryState(
    id ? `${id}-viewType` : "view",
    parseAsStringEnum(Object.values(TableViewType)).withDefault(defaultViewType),
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: data?.length || 0,
    enableSortingRemoval: false,
    getPaginationRowModel: hasPagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: initialSort ? [initialSort] : undefined,
    },
    defaultColumn: {
      enableSorting: false,
    },
  });

  return (
    <TableProvider table={table}>
      <div>
        <DataTableActions title={title}>
          {actions}

          <SortButton />

          <DataTableViewOptions />

          <Button
            onClick={() =>
              setViewType((prev) => (prev === TableViewType.GRID ? TableViewType.LIST : TableViewType.GRID))
            }
            size={"icon"}
            variant="outline"
          >
            {viewType === TableViewType.GRID && <TableProperties />}
            {viewType === TableViewType.LIST && <LayoutGrid />}
          </Button>
        </DataTableActions>

        {viewType === TableViewType.LIST ? (
          <TableView rowHeight={rowHeight} isLoading={isLoading} />
        ) : (
          <GridView isLoading={isLoading} />
        )}

        {hasPagination && <Pagination />}
      </div>
    </TableProvider>
  );
}
