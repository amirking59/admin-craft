import { OrderTable } from "@/features/orders/components/order-table";
import { dataTableSearchSchema } from "@/components/data-table";
import { m } from "@/paraglide/messages.js";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/orders")({
  validateSearch: dataTableSearchSchema,
  head: () => ({ meta: [{ title: `${m.orders_title()} · ${m.app_name()}` }] }),
  component: OrderTable,
});
