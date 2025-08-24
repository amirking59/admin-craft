import { createContext, useContext } from "react";
import { Table } from "@tanstack/react-table";

interface TableContext<TData> {
  table: Table<TData> | null;
}

const TableContext = createContext<TableContext<unknown>>({
  table: null,
});

interface TableProviderProps<TData> {
  children: React.ReactNode;
  table: Table<TData>;
}

export function TableProvider<TData>({ children, table }: TableProviderProps<TData>) {
  return (
    <TableContext.Provider
      value={
        {
          table,
        } as unknown as TableContext<unknown>
      }
    >
      {children}
    </TableContext.Provider>
  );
}

export function useTableContext<TData>() {
  const context = useContext(TableContext);

  if (context === undefined) {
    throw new Error("useTableContext must be used within a TableProvider");
  }

  return {
    table: context.table as Table<TData>,
  };
}
