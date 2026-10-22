import { ColumnDef, RowData, SortingState, useTable } from "@tanstack/react-table";
import { DataTableActions } from "@/components/data-table/components/data-table-actions";
import { Pagination } from "@/components/data-table/components/pagination";
import { DataTableViewOptions } from "@/components/data-table/components/data-table-view-options";
import { TableView } from "@/components/data-table/components/table-view";
import { TableProvider } from "@/components/data-table/table-context";
import { DataTableFeatures, dataTableFeatures } from "@/components/data-table/types";
import { getInitialColumnVisibility } from "@/components/data-table/utils";

interface DataTableProps<TData extends RowData> {
  /** Must be stable (module scope or `useMemo`); see DataTable. */
  columns: ColumnDef<DataTableFeatures, TData>[];
  initialSort?: SortingState[0];
  title?: string;
  actions?: React.ReactNode[];
  data: TData[];
  hasPagination?: boolean;
  rowHeight?: number;
  isLoading?: boolean;
}

/** Client-side table over in-memory `data`. */
export function SimpleDataTable<TData extends RowData>({
  columns,
  initialSort,
  title,
  actions = [],
  data = [],
  hasPagination = false,
  rowHeight = 61,
  isLoading = false,
}: DataTableProps<TData>) {
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
        </DataTableActions>

        <TableView rowHeight={rowHeight} isLoading={isLoading} />

        {hasPagination && <Pagination />}
      </div>
    </TableProvider>
  );
}
