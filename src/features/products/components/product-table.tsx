import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getProducts, useDeleteProduct } from "@/features/products/services";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Product, ProductCategory } from "@/features/products/types";
import { useTranslation } from "react-i18next";
import { DialogButton } from "@/components/dialog-button";
import { ProductForm } from "@/features/products/components/product-form";
import { ConfirmDialogButton } from "@/components/confirm-dialog-button";

const categoryVariant: Record<ProductCategory, "default" | "secondary" | "outline" | "destructive"> = {
  [ProductCategory.Electronics]: "default",
  [ProductCategory.Clothing]: "secondary",
  [ProductCategory.Books]: "outline",
  [ProductCategory.Accessories]: "secondary",
  [ProductCategory.Food]: "outline",
};

export const ProductTable = () => {
  const { t } = useTranslation("products");
  const deleteMutation = useDeleteProduct();

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "productId",
      header: t("productId"),
      enableSorting: true,
      size: 90,
    },
    {
      accessorKey: "name",
      header: t("name"),
      size: 200,
      meta: {
        tooltip: (context) => context.row.original.description,
      },
    },
    {
      accessorKey: "category",
      header: t("category"),
      cell: ({ row }) => (
        <Badge variant={categoryVariant[row.original.category]}>{t(`productCategory.${row.original.category}`)}</Badge>
      ),
      size: 130,
    },
    {
      accessorKey: "price",
      header: t("price"),
      cell: ({ row }) => <span>${formatNumber(row.original.price, 2)}</span>,
      size: 110,
    },
    {
      accessorKey: "stock",
      header: t("stock"),
      cell: ({ row }) => (
        <span className={row.original.stock === 0 ? "font-medium text-destructive" : undefined}>
          {formatNumber(row.original.stock, 0)}
        </span>
      ),
      size: 90,
    },
    {
      accessorKey: "isActive",
      header: t("status"),
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? t("active") : t("inactive")}
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
          <DialogButton size="icon" variant="ghost" icon={Edit} content={<ProductForm prevData={row.original} />} />
          <ConfirmDialogButton
            size="icon"
            variant="ghost"
            icon={Trash2}
            onOk={() => deleteMutation.mutate(row.original.productId)}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      queryKey="products"
      queryFn={getProducts}
      columns={columns}
      filters={[]}
      title={t("products")}
      actions={[
        <DialogButton
          key="createProduct"
          variant="outline"
          icon={Plus}
          title={t("addItem", { item: t("product"), ns: "base" })}
          content={<ProductForm />}
        />,
      ]}
      initialSort={{ desc: true, id: "productId" }}
      rowHeight={61}
    />
  );
};
