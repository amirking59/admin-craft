import { FilterDef } from "@/components/data-table/types";
import "@tanstack/react-table";
import { CellContext, CellData, RowData, TableFeatures } from "@tanstack/react-table";
import React from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > {
    label?: string;
    tooltip?: string | ((context: CellContext<TFeatures, TData, TValue>) => React.ReactNode);
    initialHidden?: boolean;
  }

  // v9 table state only holds registered feature slices, so the filter definitions ride on meta.
  interface TableMeta<in out TFeatures extends TableFeatures, in out TData extends RowData> {
    filters?: FilterDef[];
  }
}
