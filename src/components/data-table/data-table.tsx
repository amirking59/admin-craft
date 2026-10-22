import { ColumnDef, ColumnFiltersState, RowData, SortingState, useTable } from "@tanstack/react-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataTableFeatures, dataTableFeatures, DataTableQueryParams, FilterDef } from "@/components/data-table/types";
import { DataTableActions } from "@/components/data-table/components/data-table-actions";
import { DataTableViewOptions } from "@/components/data-table/components/data-table-view-options";
import { FiltersButton } from "@/components/data-table/components/filters-button";
import { Pagination } from "@/components/data-table/components/pagination";
import { TableView } from "@/components/data-table/components/table-view";
import { TableProvider } from "@/components/data-table/table-context";
import { useDataTableQueryState } from "@/components/data-table/use-data-table-query-state";
import { filtersArrayToObject, filtersObjectToArray, getInitialColumnVisibility } from "@/components/data-table/utils";

interface DataTableProps<TData extends RowData> {
  /**
   * Must be stable (module scope or `useMemo`): cells render as components, so new column definitions
   * on every render remount every cell and reset its state.
   */
  columns: ColumnDef<DataTableFeatures, TData>[];
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

/** Server-driven table: pagination, sorting and filters are sent to `queryFn`; page and filters live in the URL. */
export function DataTable<TData extends RowData>({
  columns,
  queryKey,
  initialSort,
  filters = [],
  title,
  actions = [],
  queryFn,
  rowHeight = 61,
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const { page, filters: urlFilters, setPage, setFilters } = useDataTableQueryState({ defaultPageSize: 10 });

  const [sorting, setSorting] = useState<SortingState>(initialSort ? [initialSort] : []);

  const pagination = useMemo(() => ({ pageIndex: page.index - 1, pageSize: page.size }), [page.index, page.size]);

  const columnFilters = useMemo<ColumnFiltersState>(() => filtersObjectToArray(urlFilters), [urlFilters]);

  const { data, isPending, isFetching, isPlaceholderData, refetch } = useQuery({
    queryKey: [queryKey, page, sorting, columnFilters],
    queryFn: () =>
      queryFn({
        page: { index: page.index, size: page.size },
        sort: sorting[0] ? (sorting[0].desc ? `-${sorting[0].id}` : sorting[0].id) : undefined,
        filters: filtersArrayToObject(columnFilters),
      }),
    // Keep showing the current page while the next one loads.
    placeholderData: keepPreviousData,
    gcTime: 0,
    staleTime: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Landed past the last page (e.g. its last row was deleted, or a stale URL): go back to the first page.
  const isPastLastPage = !isPlaceholderData && data?.items.length === 0 && page.index > 1;
  useEffect(() => {
    if (isPastLastPage) setPage({ index: 1 });
  }, [isPastLastPage, setPage]);

  const table = useTable({
    features: dataTableFeatures,
    data: data?.items || [],
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    rowCount: data?.total || 0,
    enableSortingRemoval: false,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    meta: { filters },
    initialState: {
      columnVisibility: getInitialColumnVisibility(columns),
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

          <Button
            onClick={() => refetch({ cancelRefetch: false })}
            size="icon"
            variant="outline"
            aria-label={t("table.refresh")}
          >
            <RefreshCcw className={cn(isFetching && "animate-spin")} />
          </Button>
        </DataTableActions>

        {/* Skeletons only on first load; later fetches dim the rows that are already there. */}
        <div aria-busy={isFetching} className={cn("transition-opacity", isFetching && !isPending && "opacity-60")}>
          <TableView rowHeight={rowHeight} isLoading={isPending} />
        </div>

        <Pagination />
      </div>
    </TableProvider>
  );
}
