import { m } from "@/paraglide/messages.js";
import { CellTooltip } from "@/components/data-table/components/cell-tooltip";
import { DataTableSortHeader, getAriaSort } from "@/components/data-table/components/sort-header";
import { useTableContext } from "@/components/data-table/table-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

interface TableViewProps {
  isLoading: boolean;
  rowHeight: number;
  /** In place of the rows when there are none: why, and what to do about it (e.g. an error and "Try again"). */
  empty?: React.ReactNode;
}

export function TableView({ isLoading, rowHeight, empty = m.table_no_results() }: TableViewProps) {
  const { table } = useTableContext();
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  aria-sort={getAriaSort(header.column)}
                  style={{ minWidth: header.getSize(), width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    <DataTableSortHeader column={header.column}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </DataTableSortHeader>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: table.state.pagination.pageSize }).map((_, index) => (
              <TableRow key={index} style={{ height: rowHeight }}>
                {table.getVisibleLeafColumns().map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton className="h-4 w-1/2" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} style={{ height: rowHeight }}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <CellTooltip cell={cell}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</CellTooltip>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-32 text-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">{empty}</div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
