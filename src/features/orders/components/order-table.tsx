import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/features/orders/services";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableFeatures } from "@/components/data-table/_types";
import dayjs from "dayjs";
import { formatNumber } from "@/lib/utils";
import { Order, OrderStatus } from "@/features/orders/types";
import { useTranslation } from "react-i18next";
import { FilterDef, FilterOperator } from "@/components/data-table/_types";
import { EnumField } from "@/components/form/enum-field";
import { DateField } from "@/components/form/date-field";

const statusVariant: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  [OrderStatus.Pending]: "secondary",
  [OrderStatus.Processing]: "outline",
  [OrderStatus.Shipped]: "default",
  [OrderStatus.Delivered]: "default",
  [OrderStatus.Cancelled]: "destructive",
};

export const OrderTable = () => {
  const { t } = useTranslation("orders");

  const columns: ColumnDef<DataTableFeatures, Order>[] = [
    {
      accessorKey: "orderId",
      header: t("orderId"),
      enableSorting: true,
      size: 100,
    },
    {
      id: "customer",
      header: t("customer"),
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.customerName}</div>
          <div className="text-xs text-muted-foreground">{row.original.customerEmail}</div>
        </div>
      ),
      meta: {
        tooltip: (context) => context.row.original.customerEmail,
      },
      size: 200,
    },
    {
      accessorKey: "product",
      header: t("product"),
      size: 200,
    },
    {
      accessorKey: "quantity",
      header: t("quantity"),
      size: 80,
    },
    {
      accessorKey: "total",
      header: t("total"),
      cell: ({ row }) => <span className="font-medium">${formatNumber(row.original.total, 2)}</span>,
      size: 110,
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status]}>{t(`orderStatus.${row.original.status}`)}</Badge>
      ),
      size: 120,
    },
    {
      accessorKey: "createdAt",
      header: t("createdAt"),
      cell: ({ row }) => <span>{dayjs(row.original.createdAt).format("YYYY/MM/DD")}</span>,
      size: 120,
    },
  ];

  const filters: FilterDef[] = [
    {
      name: "status",
      operator: FilterOperator.Equal,
      input: () => (
        <EnumField
          enumObject={OrderStatus}
          getItemLabel={(value) => t(`orderStatus.${value}`)}
          multiple
          clearable
          placeholder={t("status")}
        />
      ),
    },
    {
      name: "created_at_from",
      operator: FilterOperator.BetweenDate,
      input: () => <DateField mode="single" clearable placeholder={t("createdAt")} />,
    },
  ];

  return (
    <DataTable
      queryKey="orders"
      queryFn={getOrders}
      columns={columns}
      filters={filters}
      title={t("orders")}
      initialSort={{ desc: true, id: "orderId" }}
      rowHeight={61}
    />
  );
};
