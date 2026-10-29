import { useCallback, useMemo } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { DataTableFilters } from "@/components/data-table/types";
import type { DataTableSearch } from "@/components/data-table/search";

interface DataTablePageState {
  index: number;
  size: number;
}

interface UseDataTableQueryStateOptions {
  defaultPageSize?: number;
}

/** Page, sort and filters, read from and written to the URL. The route validates them with `dataTableSearchSchema`. */
export function useDataTableQueryState({ defaultPageSize = 10 }: UseDataTableQueryStateOptions = {}) {
  const navigate = useNavigate();
  // The router parses search with qs (see src/router.tsx), then the route's validateSearch types it.
  const search: DataTableSearch = useSearch({ strict: false });

  const page = useMemo<DataTablePageState>(
    () => ({ index: search.page?.index ?? 1, size: search.page?.size ?? defaultPageSize }),
    [search.page?.index, search.page?.size, defaultPageSize],
  );

  const filters = useMemo<DataTableFilters>(() => search.filters ?? {}, [search.filters]);

  // Merged into the URL's search as it is when the navigation runs, not as of this render: two changes in a row
  // (a saved view's sort, then its filters) both land.
  const pushQuery = useCallback(
    (patch: DataTableSearch) => {
      navigate({
        to: ".",
        search: ((current: DataTableSearch) => ({ ...current, ...patch })) as never,
        replace: true,
        resetScroll: false,
      });
    },
    [navigate],
  );

  const setPage = useCallback(
    (next: Partial<DataTablePageState>) => {
      pushQuery({ page: { index: next.index ?? page.index, size: next.size ?? page.size } });
    },
    [page.index, page.size, pushQuery],
  );

  // A new sort or new filters change which rows come first, so both go back to page 1.
  const setSort = useCallback(
    (sort: string | undefined) => {
      pushQuery({ sort, page: { index: 1, size: page.size } });
    },
    [page.size, pushQuery],
  );

  const setFilters = useCallback(
    (nextFilters: DataTableFilters) => {
      const hasFilters = Object.keys(nextFilters).length > 0;
      pushQuery({ filters: hasFilters ? nextFilters : undefined, page: { index: 1, size: page.size } });
    },
    [page.size, pushQuery],
  );

  return { page, sort: search.sort, filters, setPage, setSort, setFilters };
}
