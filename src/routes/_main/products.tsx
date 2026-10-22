import { ProductTable } from "@/features/products/components/product-table";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/products")({
  component: ProductTable,
});
