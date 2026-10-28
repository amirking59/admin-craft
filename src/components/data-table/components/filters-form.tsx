import { m } from "@/paraglide/messages.js";
import { useTableContext } from "@/components/data-table/table-context";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isFilterValueEmpty } from "@/components/data-table/utils";
import { useAppForm } from "@/components/form/use-app-form";

interface FiltersFormProps {
  onClose?: () => void;
}

export function FiltersForm({ onClose }: FiltersFormProps) {
  const { table } = useTableContext();
  const filters = table.options.meta?.filters ?? [];

  const form = useAppForm({
    defaultValues: filters.reduce(
      (acc, filter) => {
        const initialValue = table.state.columnFilters.find((columnFilter) => columnFilter.id === filter.name)
          ?.value as string | string[] | undefined;

        acc[filter.name] = initialValue ?? "";
        return acc;
      },
      {} as Record<string, any>,
    ),
    onSubmit: ({ value }) => {
      onClose?.();

      table.setColumnFilters(
        Object.entries(value)
          .filter(([, value]) => !isFilterValueEmpty(value))
          .map(([key, value]) => ({ id: key, value })),
      );
    },
  });

  function resetFilters() {
    table.resetColumnFilters(true);

    form.reset(
      filters.reduce(
        (acc, filter) => {
          acc[filter.name] = "";
          return acc;
        },
        {} as Record<string, any>,
      ),
    );
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <DialogHeader>
        <DialogTitle>{m.table_filters()}</DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filters?.map((filter) => {
          if (!filter.input) return null;

          return (
            <form.AppField
              key={filter.name}
              name={filter.name}
              listeners={{ onChange: () => filter.onValueChange?.(form) }}
            >
              {/* The filter input reads its name/value from the field context. */}
              {() => filter.input?.()}
            </form.AppField>
          );
        })}
      </div>

      <DialogFooter>
        {table.state.columnFilters.length > 0 && (
          <Button onClick={resetFilters} type="button" variant={"outline"}>
            {m.table_reset_filters()}
          </Button>
        )}

        <DialogClose render={<Button variant="outline" />}>{m.cancel()}</DialogClose>

        <Button type="submit">{m.submit()}</Button>
      </DialogFooter>
    </form>
  );
}
