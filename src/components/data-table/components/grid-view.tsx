import { CellTooltip } from "@/components/data-table/components/cell-tooltip";
import { EditableField } from "@/components/data-table/components/editable-field";
import { useTableContext } from "@/components/data-table/table-context";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { flexRender } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

interface GridViewProps {
  isLoading: boolean;
}

export function GridView({ isLoading }: GridViewProps) {
  const { table } = useTableContext();
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-3">
      {isLoading ? (
        Array.from({ length: table.state.pagination.pageSize }).map((_, index) => (
          <Skeleton key={index} className="h-96 rounded-xl" />
        ))
      ) : table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => {
          return (
            <Card key={row.id}>
              <CardContent className="space-y-6">
                {row.getVisibleCells().map((cell) => {
                  return (
                    <div className="flex items-center justify-between gap-4 break-all" key={cell.id}>
                      <div className="shrink-0 grow text-sm font-medium">
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
        <div className="col-span-full flex h-24 items-center justify-center text-sm text-muted-foreground">
          {t("table.noResults")}
        </div>
      )}
    </div>
  );
}
