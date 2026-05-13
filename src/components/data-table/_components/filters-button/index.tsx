import { FiltersForm } from "@/components/data-table/_components/filters-button/_components/filters-form";
import { useTableContext } from "@/components/data-table/_context/table";
import { DialogButton } from "@/components/dialog-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

export const FiltersButton = () => {
  const { t } = useTranslation();
  const { table } = useTableContext();

  return (
    table?.getState().filters?.length > 0 && (
      <DialogButton
        customTrigger={
          <Button className="relative" variant="outline">
            <Filter />
            {t("table.filters")}

            {table.getState().columnFilters.length > 0 && (
              <Badge
                className={cn(
                  "absolute top-0 start-0 text-background rounded-full leading-1 ltr:-translate-x-1/2 rtl:translate-x-1/2 size-5 -translate-y-1/2 pt-1.5",
                )}
              >
                {table.getState().columnFilters.length > 10 ? "10+" : table.getState().columnFilters.length}
              </Badge>
            )}
          </Button>
        }
        content={<FiltersForm />}
      />
    )
  );
};
