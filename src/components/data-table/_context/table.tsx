import { createContext, useContext } from "react";
import { ReactTable, RowData } from "@tanstack/react-table";
import { DataTableFeatures } from "@/components/data-table/_types";

interface TableContext<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData> | null;
}

const TableContext = createContext<TableContext<RowData>>({
  table: null,
});

interface TableProviderProps<TData extends RowData> {
  children: React.ReactNode;
  table: ReactTable<DataTableFeatures, TData>;
}

export function TableProvider<TData extends RowData>({ children, table }: TableProviderProps<TData>) {
  return (
    <TableContext.Provider
      value={
        {
          table,
        } as unknown as TableContext<RowData>
      }
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTableContext<TData extends RowData = RowData>() {
  const context = useContext(TableContext);

  if (context === undefined) {
    throw new Error("useTableContext must be used within a TableProvider");
  }

  return {
    table: context.table as ReactTable<DataTableFeatures, TData>,
  };
}
