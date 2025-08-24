import { filterSchema } from "@/components/data-table";
import { parseAsArrayOf, parseAsJson, useQueryState } from "nuqs";

export const useFormFilters = () => {
  const [filters] = useQueryState("filters", parseAsArrayOf(parseAsJson(filterSchema.parse)));

  return {
    filters,
    getFilterValue: (name: string) => {
      if (!filters) return "";

      return filters?.find((filter) => filter.id === name)?.value || "";
    },
  };
};
