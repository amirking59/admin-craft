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

  const pushQuery = useCallback(
    (next: DataTableSearch) => {
      navigate({ to: ".", search: next as never, replace: true, resetScroll: false });
    },
    [navigate],
  );

  const setPage = useCallback(
    (next: Partial<DataTablePageState>) => {
      pushQuery({ ...search, page: { index: next.index ?? page.index, size: next.size ?? page.size } });
    },
    [search, page.index, page.size, pushQuery],
  );

  // A new sort or new filters change which rows come first, so both go back to page 1.
  const setSort = useCallback(
    (sort: string | undefined) => {
      pushQuery({ ...search, sort, page: { index: 1, size: page.size } });
    },
    [search, page.size, pushQuery],
  );

  const setFilters = useCallback(
    (nextFilters: DataTableFilters) => {
      const hasFilters = Object.keys(nextFilters).length > 0;
      pushQuery({ ...search, filters: hasFilters ? nextFilters : undefined, page: { index: 1, size: page.size } });
    },
    [search, page.size, pushQuery],
  );

  return { page, sort: search.sort, filters, setPage, setSort, setFilters };
}
