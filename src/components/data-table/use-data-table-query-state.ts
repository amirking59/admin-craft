import { useCallback, useMemo } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { DataTableFilters } from "@/components/data-table/types";

interface DataTablePageState {
  index: number;
  size: number;
}

type DataTableQuery = {
  filters?: DataTableFilters;
  page?: { index?: number | string; size?: number | string };
  [key: string]: unknown;
};

interface UseDataTableQueryStateOptions {
  defaultPageSize?: number;
}

export function useDataTableQueryState({ defaultPageSize = 10 }: UseDataTableQueryStateOptions = {}) {
  const navigate = useNavigate();
  // The router parses search with qs (see src/router.tsx).
  const parsed = useSearch({ strict: false }) as DataTableQuery;

  const page = useMemo<DataTablePageState>(() => {
    const index = Number(parsed.page?.index);
    const size = Number(parsed.page?.size);
    return {
      index: Number.isFinite(index) && index > 0 ? index : 1,
      size: Number.isFinite(size) && size > 0 ? size : defaultPageSize,
    };
  }, [parsed.page?.index, parsed.page?.size, defaultPageSize]);

  const filters = useMemo<DataTableFilters>(
    () => (parsed.filters && typeof parsed.filters === "object" ? parsed.filters : {}),
    [parsed.filters],
  );

  const pushQuery = useCallback(
    (next: DataTableQuery) => {
      navigate({ to: ".", search: next as never, replace: true, resetScroll: false });
    },
    [navigate],
  );

  const setPage = useCallback(
    (next: Partial<DataTablePageState>) => {
      pushQuery({
        ...parsed,
        page: { index: next.index ?? page.index, size: next.size ?? page.size },
      });
    },
    [parsed, page.index, page.size, pushQuery],
  );

  const setFilters = useCallback(
    (nextFilters: DataTableFilters) => {
      const { filters: _previousFilters, ...rest } = parsed;
      const hasFilters = Object.keys(nextFilters).length > 0;

      pushQuery({
        ...rest,
        ...(hasFilters ? { filters: nextFilters } : {}),
        page: { index: 1, size: page.size },
      });
    },
    [parsed, page.size, pushQuery],
  );

  return { page, filters, setPage, setFilters };
}
