import { m } from "@/paraglide/messages.js";
import { DataTable, DataTableFeatures, FilterDef } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getProducts, searchCategories, useDeleteProduct } from "@/features/products/services";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash2 } from "lucide-react";
import { convertCase, formatNumber } from "@/lib/utils";
import { Product } from "@/features/products/types";
import { DialogButton } from "@/components/dialog-button";
import { ProductForm } from "@/features/products/components/product-form";
import { ConfirmDialogButton } from "@/components/confirm-dialog-button";
import { useMemo } from "react";

// A category's name from its slug ("home-decoration" → "Home Decoration"), as DummyJSON names them.
const categoryName = (slug: string) => convertCase(slug, "title");

// DummyJSON searches or lists one category, not both, so picking one clears the other.
const filters: FilterDef[] = [
  {
    name: "q",
    label: m.products_search,
    type: "text",
    pinned: true,
    onValueChange: (form) => {
      if (form.getFieldValue("q")) form.setFieldValue("category", "", { dontRunListeners: true });
    },
  },
  {
    name: "category",
    label: m.products_category,
    type: "select",
    loadOptions: searchCategories,
    formatValue: (value) => categoryName(String(value)),
    onValueChange: (form) => {
      if (form.getFieldValue("category")) form.setFieldValue("q", "", { dontRunListeners: true });
    },
  },
];

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
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <img
              src={row.original.thumbnail}
              alt=""
              loading="lazy"
              className="size-9 rounded-md bg-muted object-cover"
            />
            <span className="truncate">{row.original.name}</span>
          </div>
        ),
        size: 260,
        meta: {
          tooltip: (context) => context.row.original.description,
        },
      },
      {
        accessorKey: "category",
        header: m.products_category(),
        cell: ({ row }) => <Badge variant="secondary">{categoryName(row.original.category)}</Badge>,
        size: 150,
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
        enableSorting: true,
        cell: ({ row }) => (
          <span className={row.original.stock === 0 ? "font-medium text-destructive" : undefined}>
            {formatNumber(row.original.stock, 0)}
          </span>
        ),
        size: 90,
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
      filters={filters}
      title={m.products_title()}
      actions={[
        <DialogButton
          key="createProduct"
          size="sm"
          icon={Plus}
          title={m.add_item({ item: m.products_product() })}
          content={(close) => <ProductForm onClose={close} />}
        />,
      ]}
      initialSort={{ desc: false, id: "productId" }}
      rowHeight={61}
    />
  );
};
