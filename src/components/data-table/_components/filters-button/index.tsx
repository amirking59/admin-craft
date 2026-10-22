import { FiltersForm } from "@/components/data-table/_components/filters-button/_components/filters-form";
import { useTableContext } from "@/components/data-table/_context/table";
import { DialogButton } from "@/components/dialog-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FiltersButton = () => {
  const { t } = useTranslation();
  const { table } = useTableContext();

  return (
    !!table?.options.meta?.filters?.length && (
      <DialogButton content={(close) => <FiltersForm onClose={close} />} icon={Filter} title={t("table.filters")}>
        {table.state.columnFilters.length > 0 && (
          <Badge
            className={cn(
              "absolute start-0 top-0 size-5 -translate-y-1/2 rounded-full pt-1.5 leading-1 text-background ltr:-translate-x-1/2 rtl:translate-x-1/2",
            )}
          >
            {table.state.columnFilters.length > 10 ? "10+" : table.state.columnFilters.length}
          </Badge>
        )}
      </DialogButton>
    )
  );
};
