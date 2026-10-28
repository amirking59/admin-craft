import { m } from "@/paraglide/messages.js";
import { DataTable, DataTableFeatures } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getProducts, useDeleteProduct } from "@/features/products/services";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Product, ProductCategory } from "@/features/products/types";
import { DialogButton } from "@/components/dialog-button";
import { ProductForm } from "@/features/products/components/product-form";
import { ConfirmDialogButton } from "@/components/confirm-dialog-button";
import { categoryLabel } from "@/features/products/labels";
import { useMemo } from "react";

const categoryVariant: Record<ProductCategory, "default" | "secondary" | "outline" | "destructive"> = {
  [ProductCategory.Electronics]: "default",
  [ProductCategory.Clothing]: "secondary",
  [ProductCategory.Books]: "outline",
  [ProductCategory.Accessories]: "secondary",
  [ProductCategory.Food]: "outline",
};

export const ProductTable = () => {
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  // Must be stable: flexRender renders `cell` as a component, so a new function each render remounts
  // every cell and resets its state (e.g. the open delete confirm dialog when the mutation status changes).
  const columns = useMemo<ColumnDef<DataTableFeatures, Product>[]>(
    () => [
      {
        accessorKey: "productId",
        header: m.products_product_id(),
        enableSorting: true,
        size: 90,
      },
      {
        accessorKey: "name",
        header: m.products_name(),
        size: 200,
        meta: {
          tooltip: (context) => context.row.original.description,
        },
      },
      {
        accessorKey: "category",
        header: m.products_category(),
        cell: ({ row }) => (
          <Badge variant={categoryVariant[row.original.category]}>{categoryLabel[row.original.category]()}</Badge>
        ),
        size: 130,
      },
      {
        accessorKey: "price",
        header: m.products_price(),
        enableSorting: true,
        cell: ({ row }) => <span>${formatNumber(row.original.price, 2)}</span>,
        size: 110,
      },
      {
        accessorKey: "stock",
        header: m.products_stock(),
        cell: ({ row }) => (
          <span className={row.original.stock === 0 ? "font-medium text-destructive" : undefined}>
            {formatNumber(row.original.stock, 0)}
          </span>
        ),
        size: 90,
      },
      {
        accessorKey: "isActive",
        header: m.products_status(),
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "default" : "secondary"}>
            {row.original.isActive ? m.active() : m.inactive()}
          </Badge>
        ),
        size: 100,
      },
      {
        id: "actions",
        enableHiding: false,
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <DialogButton
              size="icon"
              variant="ghost"
              icon={Edit}
              aria-label={m.update_item({ item: m.products_product() })}
              content={(close) => <ProductForm prevData={row.original} onClose={close} />}
            />
            <ConfirmDialogButton
              size="icon"
              variant="ghost"
              icon={Trash2}
              aria-label={m.delete_item({ item: m.products_product() })}
              onOk={() => deleteProduct(row.original.productId)}
            />
          </div>
        ),
      },
    ],
    [deleteProduct],
  );

  return (
    <DataTable
      queryKey="products"
      queryFn={getProducts}
      columns={columns}
      filters={[]}
      title={m.products_title()}
      actions={[
        <DialogButton
          key="createProduct"
          variant="outline"
          icon={Plus}
          title={m.add_item({ item: m.products_product() })}
          content={(close) => <ProductForm onClose={close} />}
        />,
      ]}
      initialSort={{ desc: true, id: "productId" }}
      rowHeight={61}
    />
  );
};
