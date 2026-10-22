import { CellTooltip } from "@/components/data-table/_components/cell-tooltip";
import { EditableField } from "@/components/data-table/_components/editable-field";
import { DataTableSortHeader } from "@/components/data-table/_components/sort-header";
import { useTableContext } from "@/components/data-table/_context/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

interface TableViewProps {
  isLoading: boolean;
  rowHeight: number;
}

export function TableView({ isLoading, rowHeight }: TableViewProps) {
  const { table } = useTableContext();
  const { t } = useTranslation();

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      minWidth: `${header.getSize()}px`,
                      width: `${header.getSize()}px`,
                    }}
                  >
                    <DataTableSortHeader column={header.column}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </DataTableSortHeader>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: table?.state.pagination.pageSize }).map((_, index) => (
              <TableRow key={index}>
                {table.getVisibleFlatColumns().map((_, colIndex) => (
                  <TableCell style={{ height: rowHeight + "px" }} key={colIndex}>
                    <Skeleton className="h-full w-1/2" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow className="h-14" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <CellTooltip cell={cell}>
                      <EditableField cell={cell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </EditableField>
                    </CellTooltip>
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center">
                {t("table.noResults")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
