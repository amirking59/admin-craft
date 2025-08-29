import { createSerializer, parseAsArrayOf, parseAsJson } from "nuqs";
import { z } from "zod";

const serialize = createSerializer({
  filters: parseAsArrayOf(
    parseAsJson(
      z.object({
        id: z.string(),
        value: z.string(),
      }).parse,
    ),
  ),
});

export const serializeDataTableFilters = serialize;

export const isFilterValueEmpty = (value: unknown) => {
  if (value == null) return true;

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "string") {
    return value.trim() === "";
  }

  return false;
};
