import { ColumnDef, RowData, SortingState, useTable } from "@tanstack/react-table";
import { DataTableActions } from "@/components/data-table/components/data-table-actions";
import { Pagination } from "@/components/data-table/components/pagination";
import { DataTableViewOptions } from "@/components/data-table/components/data-table-view-options";
import { TableView } from "@/components/data-table/components/table-view";
import { TableProvider } from "@/components/data-table/table-context";
import { DataTableFeatures, dataTableFeatures, TableViewType } from "@/components/data-table/types";
import { GridView } from "@/components/data-table/components/grid-view";
import { getInitialColumnVisibility } from "@/components/data-table/utils";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LayoutGrid, TableProperties } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DataTableProps<TData extends RowData> {
  /** Must be stable (module scope or `useMemo`); see DataTable. */
  columns: ColumnDef<DataTableFeatures, TData>[];
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

/** Client-side table over in-memory `data`, with an optional grid view toggled through the URL. */
export function SimpleDataTable<TData extends RowData>({
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
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const viewTypeKey = id ? `${id}-viewType` : "view";
  const navigate = useNavigate();
  const searchViewType = useSearch({
    strict: false,
    select: (search) => (search as Record<string, unknown>)[viewTypeKey],
  });
  const viewType = Object.values(TableViewType).includes(searchViewType as TableViewType)
    ? (searchViewType as TableViewType)
    : defaultViewType;
  const setViewType = (next: TableViewType) =>
    navigate({ to: ".", search: ((prev: object) => ({ ...prev, [viewTypeKey]: next })) as never, replace: true });

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    rowCount: data?.length || 0,
    enableSortingRemoval: false,
    // Skips the paginated row model, as omitting getPaginationRowModel did in v8.
    manualPagination: !hasPagination,
    initialState: {
      sorting: initialSort ? [initialSort] : [],
      columnVisibility: getInitialColumnVisibility(columns),
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
            onClick={() => setViewType(viewType === TableViewType.GRID ? TableViewType.LIST : TableViewType.GRID)}
            size="icon"
            variant="outline"
            aria-label={viewType === TableViewType.GRID ? t("table.listView") : t("table.gridView")}
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
