"use client";

import { ColumnDef, ColumnFiltersState, getCoreRowModel, SortingState, useReactTable } from "@tanstack/react-table";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { DataTableQueryParams, FilterDef } from "@/components/data-table/_types";
import { DataTableActions } from "@/components/data-table/_components/data-table-actions";
import { Pagination } from "@/components/data-table/_components/pagination";
import { DataTableViewOptions } from "@/components/data-table/_components/data-table-view-options";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableView } from "@/components/data-table/_components/table-view";
import { TableProvider } from "@/components/data-table/_context/table";
import { FiltersButton } from "@/components/data-table/_components/filters-button";
import { filtersArrayToObject, filtersObjectToArray } from "@/components/data-table/_utils";
import { useDataTableQueryState } from "@/components/data-table/_hooks/use-data-table-query-state";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  filters?: FilterDef[];
  initialSort?: SortingState[0];
  title?: string;
  actions?: React.ReactNode[];
  queryKey: string;
  queryFn: (params: DataTableQueryParams) => Promise<{
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
  const { page, filters: urlFilters, setPage, setFilters } = useDataTableQueryState({ defaultPageSize: 10 });

  const [sorting, setSorting] = useState<SortingState>(initialSort ? [initialSort] : []);

  const pagination = useMemo(
    () => ({ pageIndex: page.index - 1, pageSize: page.size }),
    [page.index, page.size],
  );

  const columnFilters = useMemo<ColumnFiltersState>(() => filtersObjectToArray(urlFilters), [urlFilters]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: [queryKey, page, sorting, columnFilters],
    queryFn: async () => {
      const response = await queryFn({
        page: { index: page.index, size: page.size },
        sort: sorting[0] ? (sorting[0].desc ? `-${sorting[0].id}` : sorting[0].id) : undefined,
        filters: filtersArrayToObject(columnFilters),
      });

      if (response.items.length === 0 && page.index > 1) {
        setPage({ index: 1 });
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
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      setPage({ index: next.pageIndex + 1, size: next.pageSize });
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      const next = typeof updater === "function" ? updater(columnFilters) : updater;
      setFilters(filtersArrayToObject(next));
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
