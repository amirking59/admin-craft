import { z } from "zod";

/**
 * The search params a DataTable keeps in the URL. Give it to the table's route as `validateSearch`.
 * - `page`: 1-based index and page size
 * - `sort`: a column id, with a leading `-` for descending, e.g. `-createdAt`
 * - `filters`: the filter form's values
 * A bad value (e.g. a hand-edited URL) falls back to the default instead of failing the route.
 */
export const dataTableSearchSchema = z.object({
  page: z
    .object({
      index: z.coerce.number().int().positive().optional().catch(undefined),
      size: z.coerce.number().int().positive().max(100).optional().catch(undefined),
    })
    .optional()
    .catch(undefined),
  sort: z.string().optional().catch(undefined),
  // Values are strings, as a pasted URL gives them; a number from a number field becomes one too.
  filters: z
    .record(z.string(), z.union([z.array(z.coerce.string()), z.coerce.string()]))
    .optional()
    .catch(undefined),
});

export type DataTableSearch = z.infer<typeof dataTableSearchSchema>;
