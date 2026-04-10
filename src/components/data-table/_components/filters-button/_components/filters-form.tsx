import { useTableContext } from "@/components/data-table/_context/table";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { cloneElement } from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface FiltersFormProps {
  onClose?: () => void;
}

export function FiltersForm({ onClose }: FiltersFormProps) {
  const { table } = useTableContext();
  const { t } = useTranslation();

  const filters = table.getState().filters;

  const form = useForm<Record<string, string>>({
    defaultValues: filters.reduce(
      (acc, filter) => {
        const initialValue = table.getState().columnFilters.find((columnFilter) => columnFilter.id === filter.name)
          ?.value as string | undefined;

        acc[filter.name] = initialValue ?? "";
        return acc;
      },
      {} as Record<string, string>,
    ),
  });

  function onSubmit(values: Record<string, string>) {
    onClose?.();

    table.setColumnFilters(
      Object.entries(values)
        .filter(([, value]) => value !== "" && value !== null && value !== undefined)
        .map(([key, value]) => ({ id: key, value })),
    );
  }

  function resetFilters() {
    table.resetColumnFilters(true);

    form.reset(
      filters.reduce(
        (acc, filter) => {
          acc[filter.name] = "";
          return acc;
        },
        {} as Record<string, string>,
      ),
    );
  }

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>{t("table.filters")}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filters?.map((filter) => {
            if (!filter.input) return null;

            const props: {
              name: string;
              onValueChange?: (form: UseFormReturn<Record<string, string>, any, Record<string, string>>) => void;
              key: string;
            } = {
              name: filter.name,
              key: filter.name,
            };

            if (filter.onValueChange) {
              props.onValueChange = () => filter.onValueChange?.(form);
            }

            return cloneElement(
              filter.input() as React.ReactElement<{
                name: string;
                onChange: (form: UseFormReturn<Record<string, string>, any, Record<string, string>>) => void;
              }>,
              props,
            );
          })}
        </div>

        <DialogFooter>
          {table.getState().columnFilters.length > 0 && (
            <Button onClick={resetFilters} type="button" variant={"outline"}>
              {t("table.resetFilters")}
            </Button>
          )}

          <DialogClose render={<Button variant="outline" />}>{t("cancel")}</DialogClose>

          <Button type="submit">{t("submit")}</Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
