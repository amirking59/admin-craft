"use client";

import { ColumnDef, getCoreRowModel, SortingState, useReactTable } from "@tanstack/react-table";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { parseAsArrayOf, parseAsJson, parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { z } from "zod";
import { FilterDef, FilterOperator, TableViewType } from "@/components/data-table/_types";
import { DataTableActions } from "@/components/data-table/_components/data-table-actions";
import { Pagination } from "@/components/data-table/_components/pagination";
import { DataTableViewOptions } from "@/components/data-table/_components/data-table-view-options";
import { LayoutGrid, RefreshCcw, TableProperties } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QUERY_KEYS } from "@admin-panel/services/queries/keys";
import { TableView } from "@/components/data-table/_components/table-view";
import { TableProvider } from "@/components/data-table/_context/table";
import { GlobalSearchField } from "@/components/data-table/_components/global-search-field";
import { FiltersButton } from "@/components/data-table/_components/filters-button";
import { GridView } from "@/components/data-table/_components/grid-view";
import { SortButton } from "@/components/data-table/_components/sort-button";
import { BaseService } from "@frontend-utils";
import { baseQuery } from "@admin-panel/services/queries/baseQuery";

const sortSchema = z.object({
  pageIndex: z.number(),
  pageSize: z.number(),
});

export const filterSchema = z.object({
  id: z.string(),
  value: z.string(),
});

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  filters?: FilterDef[];
  queryKey: QUERY_KEYS;
  service: new () => BaseService;
  initialSort?: SortingState[0];
  title?: string;
  globalSearchFields?: string[];
  actions?: React.ReactNode[];
  defaultViewType?: TableViewType;
  queryFnAdditionalData?: object;
  rowHeight?: number;
  id?: string;
}

export function DataTable<TData, TValue>({
  columns,
  queryKey,
  initialSort,
  filters = [],
  title,
  globalSearchFields = [],
  actions = [],
  service,
  defaultViewType = TableViewType.LIST,
  queryFnAdditionalData = {},
  rowHeight = 61,
  id,
}: DataTableProps<TData, TValue>) {
  filters = filters.map((filter) => ({
    ...filter,
    name: filter.name.replaceAll(".", "*"),
  }));

  const [viewType, setViewType] = useQueryState(
    id ? `${id}-viewType` : "view",
    parseAsStringEnum(Object.values(TableViewType)).withDefault(defaultViewType),
  );
  const [pagination, setPagination] = useQueryState(
    id ? `${id}-pagination` : "pagination",
    parseAsJson(sortSchema.parse).withDefault({
      pageIndex: 0,
      pageSize: 10,
    }),
  );
  const [sorting, setSorting] = useState<SortingState>(initialSort ? [initialSort] : []);
  const [globalSearch, setGlobalSearch] = useQueryState(id ? `${id}-search` : "search", parseAsString.withDefault(""));
  const [columnFilters, setColumnFilters] = useQueryState(
    id ? `${id}-filters` : "filters",
    parseAsArrayOf(parseAsJson(filterSchema.parse)).withDefault(
      filters
        .filter((filter) => filter.defaultValue !== undefined)
        .map((filter) => ({
          id: filter.name,
          value: filter.defaultValue ?? "",
        })),
    ),
  );

  const { data, isFetching, refetch } = useQuery({
    queryKey: [queryKey, pagination, sorting, columnFilters, globalSearch],
    queryFn: async () => {
      const queryFn = baseQuery.createService(service)?.[queryKey];

      const response = await queryFn?.({
        limit: pagination.pageSize,
        skip: pagination.pageIndex * pagination.pageSize,
        sort: sorting.map((sort) => ({
          field: sort.id,
          operator: sort.desc ? "des" : "asc",
        })),
        query: [
          ...columnFilters
            .filter((filter) => filter.value)
            .map((filter) => {
              const filterDef = filters.find((f) => f.name === filter.id);

              if (!filterDef) {
                throw new Error(`Filter definition not found for ${filter.id}`);
              }

              return {
                value: filterDef.transformValue ? filterDef.transformValue(filter.value) : filter.value,
                field: filter.id.replaceAll("*", "."),
                operator: filterDef.operator,
              };
            }),
          ...(globalSearchFields.length > 0 && globalSearch
            ? [
                {
                  field: globalSearchFields,
                  operator: FilterOperator.Like,
                  value: globalSearch,
                },
              ]
            : []),
        ],
        ...queryFnAdditionalData,
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
      globalSearch,
      filters,
    },
    onStateChange: (updater) => {
      const newState = typeof updater === "function" ? updater(table.getState()) : updater;

      setPagination(newState.pagination);
      setSorting(newState.sorting);
      setColumnFilters(newState.columnFilters as z.infer<typeof filterSchema>[]);
      setGlobalSearch(newState.globalSearch || "");
    },
    defaultColumn: {
      enableSorting: false,
    },
  });

  return (
    <TableProvider table={table}>
      <DataTableActions title={title}>
        {actions}

        <GlobalSearchField globalSearchFields={globalSearchFields} />

        <FiltersButton />

        {viewType === TableViewType.GRID && <SortButton />}

        <DataTableViewOptions />

        <Button
          onClick={() => setViewType((prev) => (prev === TableViewType.GRID ? TableViewType.LIST : TableViewType.GRID))}
          size={"icon"}
          variant="outline"
        >
          {viewType === TableViewType.GRID && <TableProperties />}
          {viewType === TableViewType.LIST && <LayoutGrid />}
        </Button>

        <Button onClick={() => refetch({ cancelRefetch: false })} size={"icon"} variant="outline">
          <RefreshCcw />
        </Button>
      </DataTableActions>

      {viewType === TableViewType.LIST ? (
        <TableView rowHeight={rowHeight} isLoading={isFetching} />
      ) : (
        <GridView isLoading={isFetching} />
      )}

      <Pagination />
    </TableProvider>
  );
}
