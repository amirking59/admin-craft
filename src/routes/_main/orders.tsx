import { OrderTable } from "@/features/orders/components/order-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/orders")({
  component: OrderTable,
});
