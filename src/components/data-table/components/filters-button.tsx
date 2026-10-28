import { m } from "@/paraglide/messages.js";
import { FiltersForm } from "@/components/data-table/components/filters-form";
import { useTableContext } from "@/components/data-table/table-context";
import { DialogButton } from "@/components/dialog-button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

export const FiltersButton = () => {
  const { table } = useTableContext();

  if (!table.options.meta?.filters?.length) return null;

  const activeCount = table.state.columnFilters.length;

  return (
    <DialogButton
      className="relative"
      content={(close) => <FiltersForm onClose={close} />}
      icon={Filter}
      title={m.table_filters()}
    >
      {activeCount > 0 && (
        <Badge className="absolute start-0 top-0 size-5 -translate-y-1/2 rounded-full px-0 ltr:-translate-x-1/2 rtl:translate-x-1/2">
          {activeCount > 10 ? "10+" : activeCount}
        </Badge>
      )}
    </DialogButton>
  );
};
