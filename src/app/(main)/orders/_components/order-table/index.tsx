"use client";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/app/(main)/orders/_services";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { formatNumber } from "@/utils/number";
import { Order, OrderStatus } from "@/app/(main)/orders/_types";
import { useTranslation } from "react-i18next";

const statusVariant: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  [OrderStatus.Pending]: "secondary",
  [OrderStatus.Processing]: "outline",
  [OrderStatus.Shipped]: "default",
  [OrderStatus.Delivered]: "default",
  [OrderStatus.Cancelled]: "destructive",
};

export const OrderTable = () => {
  const { t } = useTranslation("orders");

  const columns: ColumnDef<Order>[] = [
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

  return (
    <DataTable
      queryKey="orders"
      queryFn={(params) => getOrders(params as any)}
      columns={columns}
      filters={[]}
      title={t("orders")}
      initialSort={{ desc: true, id: "orderId" }}
      rowHeight={61}
    />
  );
};
