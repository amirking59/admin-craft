import { FilterDef } from "@/components/data-table/_types";
import "@tanstack/react-table";
import { CellContext } from "@tanstack/react-table";
import React from "react";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    label?: string;
    tooltip?: string | ((context: CellContext<TData, TValue>) => React.ReactNode);
    editable?: {
      onSubmit: (value: string | number, context: CellContext<TData, TValue>) => void;
      getDefaultValue?: (context: CellContext<TData, TValue>) => string | number;
      input?: React.ReactNode;
      loading?: boolean;
    };
    initialHidden?: boolean;
  }

  interface TableState {
    globalSearch: string;
    filters: FilterDef[];
  }
}
