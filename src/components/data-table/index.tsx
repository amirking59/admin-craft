"use client";

import { ColumnDef, ColumnFiltersState, getCoreRowModel, SortingState, useReactTable } from "@tanstack/react-table";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { parseAsJson, useQueryState } from "nuqs";
import { z } from "zod";
import { FilterDef } from "@/components/data-table/_types";
import { DataTableActions } from "@/components/data-table/_components/data-table-actions";
import { Pagination } from "@/components/data-table/_components/pagination";
import { DataTableViewOptions } from "@/components/data-table/_components/data-table-view-options";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableView } from "@/components/data-table/_components/table-view";
import { TableProvider } from "@/components/data-table/_context/table";
import { FiltersButton } from "@/components/data-table/_components/filters-button";
import { SortButton } from "@/components/data-table/_components/sort-button";
import { isFilterValueEmpty } from "@/components/data-table/_utils";

const sortSchema = z.object({
  pageIndex: z.number(),
  pageSize: z.number(),
});

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  filters?: FilterDef[];
  initialSort?: SortingState[0];
  title?: string;
  actions?: React.ReactNode[];
  queryKey: string;
  queryFn: ({ pageIndex, pageSize }: any) => Promise<{
    items: TData[];
    total: number;
  }>;
  rowHeight?: number;
}

export function DataTable<TData, TValue>({
  columns,
  queryKey,
  initialSort,
  filters = [],
  title,
  actions = [],
  queryFn,
  rowHeight = 61,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useQueryState(
    "pagination",
    parseAsJson(sortSchema.parse).withDefault({
      pageIndex: 0,
      pageSize: 10,
    }),
  );
  const [sorting, setSorting] = useState<SortingState>(initialSort ? [initialSort] : []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    filters
      .filter((filter) => filter.defaultValue !== undefined)
      .map((filter) => ({
        id: filter.name,
        value: filter.defaultValue || "",
      })),
  );

  useEffect(() => {
    setColumnFilters(
      filters
        .filter((filter) => filter.defaultValue !== undefined)
        .map((filter) => ({
          id: filter.name,
          value: filter.defaultValue || "",
        })),
    );
  }, [filters, setColumnFilters]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: [queryKey, pagination, sorting, columnFilters],
    queryFn: async () => {
      const formattedFilters = columnFilters.reduce(
        (acc, filter) => {
          const { id, value } = filter;

          if (!isFilterValueEmpty(value)) {
            acc[id] = value as string | string[];
          }

          return acc;
        },
        {} as Record<string, string | string[]>,
      );

      const response = await queryFn({
        ...pagination,
        sort: sorting[0]?.desc ? `-${sorting[0]?.id}` : sorting[0]?.id,
        ...formattedFilters,
      });

      if (response.items.length === 0 && pagination.pageIndex > 0) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: 0,
        }));
      }

      return response;
    },
    placeholderData: (previousData) => previousData,
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const table = useReactTable({
    data: data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: data?.total || 0,
    enableSortingRemoval: false,
    state: {
      pagination,
      sorting,
      columnFilters,
      filters,
    },
    initialState: {
      columnVisibility: columns.reduce(
        (acc, column) => {
          if (column.meta?.initialHidden && column.id) {
            acc[column.id] = false;
          }
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    },
    onStateChange: (updater) => {
      const newState = typeof updater === "function" ? updater(table.getState()) : updater;

      setPagination(newState.pagination);
      setSorting(newState.sorting);
      setColumnFilters(newState.columnFilters);
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

          <FiltersButton />

          <SortButton />

          <DataTableViewOptions />

          <Button onClick={() => refetch({ cancelRefetch: false })} size={"icon"} variant="outline">
            <RefreshCcw />
          </Button>
        </DataTableActions>

        <TableView rowHeight={rowHeight} isLoading={isFetching} />

        <Pagination />
      </div>
    </TableProvider>
  );
}
