import { CellTooltip } from "@/components/data-table/_components/cell-tooltip";
import { EditableField } from "@/components/data-table/_components/editable-field";
import { useTableContext } from "@/components/data-table/_context/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

interface GridViewProps {
  isLoading: boolean;
}

export function GridView({ isLoading }: GridViewProps) {
  const { table } = useTableContext();
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-4">
      {isLoading ? (
        Array.from({ length: table?.state.pagination.pageSize }).map((_, index) => (
          <Skeleton key={index} className="h-96 rounded-xl" />
        ))
      ) : table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => {
          return (
            <Card key={row.id}>
              <CardContent className="space-y-6">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <div className="flex break-all gap-4 justify-between items-center" key={cell.id}>
                      <div className="grow shrink-0 font-medium text-sm">
                        {cell.column.columnDef.meta?.label ??
                          (typeof cell.column.columnDef.header === "string" &&
                            cell.column.columnDef.header?.toString())}
                      </div>

                      <CellTooltip cell={cell}>
                        <EditableField cell={cell}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </EditableField>
                      </CellTooltip>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })
      ) : (
        <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 col-span-3 text-center">
          {t("table.noResults")}
        </TableCell>
      )}
    </div>
  );
}
