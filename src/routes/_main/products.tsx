import { ProductTable } from "@/features/products/components/product-table";
import { dataTableSearchSchema } from "@/components/data-table";
import { m } from "@/paraglide/messages.js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/products")({
  validateSearch: dataTableSearchSchema,
  staticData: { title: m.products_title },
  head: () => ({ meta: [{ title: `${m.products_title()} · ${m.app_name()}` }] }),
  component: ProductTable,
});
