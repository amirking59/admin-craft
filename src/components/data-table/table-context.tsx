import { createContext, useContext } from "react";
import { ReactTable, RowData } from "@tanstack/react-table";
import { DataTableFeatures } from "@/components/data-table/types";

type AnyDataTable = ReactTable<DataTableFeatures, RowData>;

const TableContext = createContext<AnyDataTable | null>(null);

interface TableProviderProps<TData extends RowData> {
  children: React.ReactNode;
  table: ReactTable<DataTableFeatures, TData>;
}

export function TableProvider<TData extends RowData>({ children, table }: TableProviderProps<TData>) {
  // Table types are invariant in TData, so the context stores it erased; useTableContext restores the row type.
  return <TableContext.Provider value={table as unknown as AnyDataTable}>{children}</TableContext.Provider>;
}

export function useTableContext<TData extends RowData = RowData>() {
  const table = useContext(TableContext);

  if (!table) {
    throw new Error("useTableContext must be used within a TableProvider");
  }

  return { table: table as unknown as ReactTable<DataTableFeatures, TData> };
}
