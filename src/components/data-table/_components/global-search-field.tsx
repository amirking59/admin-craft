import { useTableContext } from "@/components/data-table/_context/table";
import { TextField } from "@/components/form/text-field";
import { Form } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface GlobalSearchFieldProps {
  globalSearchFields: string[];
}

export function GlobalSearchField({ globalSearchFields }: GlobalSearchFieldProps) {
  const { table } = useTableContext();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      search: table?.getState().globalSearch,
    },
  });

  useEffect(() => {
    if (table?.getState().globalSearch) {
      form.setValue("search", table?.getState().globalSearch);
    }
  }, [table?.getState().globalSearch]);

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      table?.setState((prev) => ({
        ...prev,
        globalSearch: values.search || "",
      }));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (globalSearchFields.length === 0) return null;

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()}>
        <TextField
          className={cn(!isMobile && "w-56")}
          debounceMs={500}
          name="search"
          placeholder={t("search")}
          clearable
        />
      </form>
    </Form>
  );
}
