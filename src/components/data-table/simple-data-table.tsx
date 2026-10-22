import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DataTableActions } from "@/components/data-table/_components/data-table-actions";
import { Pagination } from "@/components/data-table/_components/pagination";
import { DataTableViewOptions } from "@/components/data-table/_components/data-table-view-options";
import { TableView } from "@/components/data-table/_components/table-view";
import { TableProvider } from "@/components/data-table/_context/table";
import { TableViewType } from "@/components/data-table/_types";
import { GridView } from "@/components/data-table/_components/grid-view";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LayoutGrid, TableProperties } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
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

export function SimpleDataTable<TData, TValue>({
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
}: DataTableProps<TData, TValue>) {
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    rowCount: data?.length || 0,
    enableSortingRemoval: false,
    getPaginationRowModel: hasPagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: initialSort ? [initialSort] : undefined,
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
            size={"icon"}
            variant="outline"
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
