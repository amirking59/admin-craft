import { m } from "@/paraglide/messages.js";
import { ColumnDef, ColumnFiltersState, RowData, SortingState, useTable } from "@tanstack/react-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataTableFeatures, dataTableFeatures, DataTableQueryParams, FilterDef } from "@/components/data-table/types";
import { DataTableActions } from "@/components/data-table/components/data-table-actions";
import { DataTableViewOptions } from "@/components/data-table/components/data-table-view-options";
import { FilterBar } from "@/components/data-table/components/filter-bar";
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
  /** The sort while the URL has none. */
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

// The URL's sort is a column id, with a leading "-" for descending.
const toSortParam = (sort?: SortingState[0]) => (sort ? (sort.desc ? `-${sort.id}` : sort.id) : undefined);
const fromSortParam = (sort: string): SortingState[0] =>
  sort.startsWith("-") ? { id: sort.slice(1), desc: true } : { id: sort, desc: false };

/**
 * Server-driven table: pagination, sorting and filters are sent to `queryFn`, and all three live in the URL.
 * Its route needs `validateSearch: dataTableSearchSchema`.
 */
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
  const {
    page,
    sort,
    filters: urlFilters,
    setPage,
    setSort,
    setFilters,
  } = useDataTableQueryState({ defaultPageSize: 10 });

  const sortParam = sort ?? toSortParam(initialSort);
  const sorting = useMemo<SortingState>(() => (sortParam ? [fromSortParam(sortParam)] : []), [sortParam]);

  const pagination = useMemo(() => ({ pageIndex: page.index - 1, pageSize: page.size }), [page.index, page.size]);

  const columnFilters = useMemo<ColumnFiltersState>(() => filtersObjectToArray(urlFilters), [urlFilters]);

  const { data, isPending, isFetching, isPlaceholderData, refetch } = useQuery({
    queryKey: [queryKey, page, sortParam, columnFilters],
    queryFn: () =>
      queryFn({
        page: { index: page.index, size: page.size },
        sort: sortParam,
        filters: filtersArrayToObject(columnFilters),
      }),
    // Keep showing the current page while the next one loads.
    placeholderData: keepPreviousData,
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
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSort(toSortParam(next[0]));
    },
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

          <DataTableViewOptions />

          <Button
            onClick={() => refetch({ cancelRefetch: false })}
            size="icon"
            variant="outline"
            aria-label={m.table_refresh()}
          >
            <RefreshCcw className={cn(isFetching && "animate-spin")} />
          </Button>
        </DataTableActions>

        {filters.length > 0 && <FilterBar />}

        {/* Skeletons only on first load; later fetches dim the rows that are already there. */}
        <div aria-busy={isFetching} className={cn("transition-opacity", isFetching && !isPending && "opacity-60")}>
          <TableView rowHeight={rowHeight} isLoading={isPending} />
        </div>

        <Pagination />
      </div>
    </TableProvider>
  );
}
