"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { DataTableFilters } from "@/components/data-table/_types";

const STRINGIFY_OPTIONS: qs.IStringifyOptions = {
  arrayFormat: "brackets",
  encodeValuesOnly: true,
  skipNulls: true,
};

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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parsed = useMemo(
    () => qs.parse(searchParams.toString(), { ignoreQueryPrefix: true }) as DataTableQuery,
    [searchParams],
  );

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
      const query = qs.stringify(next, STRINGIFY_OPTIONS);
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
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
