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
