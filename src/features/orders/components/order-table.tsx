import { m } from "@/paraglide/messages.js";
import { DataTable, DataTableFeatures, FilterDef, FilterOperator } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getOrders } from "@/features/orders/services";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { formatNumber } from "@/lib/utils";
import { Order, OrderStatus } from "@/features/orders/types";
import { EnumField } from "@/components/form/enum-field";
import { DateField } from "@/components/form/date-field";

const statusVariant: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  [OrderStatus.Pending]: "secondary",
  [OrderStatus.Processing]: "outline",
  [OrderStatus.Shipped]: "default",
  [OrderStatus.Delivered]: "default",
  [OrderStatus.Cancelled]: "destructive",
};

const statusLabel: Record<OrderStatus, () => string> = {
  [OrderStatus.Pending]: m.orders_order_status_pending,
  [OrderStatus.Processing]: m.orders_order_status_processing,
  [OrderStatus.Shipped]: m.orders_order_status_shipped,
  [OrderStatus.Delivered]: m.orders_order_status_delivered,
  [OrderStatus.Cancelled]: m.orders_order_status_cancelled,
};

// Module scope keeps the columns stable (DataTable needs that). The language only changes with a reload.
const columns: ColumnDef<DataTableFeatures, Order>[] = [
  {
    accessorKey: "orderId",
    header: m.orders_order_id(),
    enableSorting: true,
    size: 100,
  },
  {
    id: "customer",
    header: m.orders_customer(),
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
    header: m.orders_product(),
    size: 200,
  },
  {
    accessorKey: "quantity",
    header: m.orders_quantity(),
    enableSorting: true,
    size: 80,
  },
  {
    accessorKey: "total",
    header: m.orders_total(),
    enableSorting: true,
    cell: ({ row }) => <span className="font-medium">${formatNumber(row.original.total, 2)}</span>,
    size: 110,
  },
  {
    accessorKey: "status",
    header: m.orders_status(),
    cell: ({ row }) => <Badge variant={statusVariant[row.original.status]}>{statusLabel[row.original.status]()}</Badge>,
    size: 120,
  },
  {
    accessorKey: "createdAt",
    header: m.orders_created_at(),
    enableSorting: true,
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
        getItemLabel={(value) => statusLabel[value as OrderStatus]()}
        multiple
        clearable
        placeholder={m.orders_status()}
      />
    ),
  },
  {
    name: "created_at_from",
    operator: FilterOperator.BetweenDate,
    input: () => <DateField mode="single" clearable placeholder={m.orders_created_at()} />,
  },
];

export const OrderTable = () => (
  <DataTable
    queryKey="orders"
    queryFn={getOrders}
    columns={columns}
    filters={filters}
    title={m.orders_title()}
    initialSort={{ desc: true, id: "orderId" }}
    rowHeight={61}
  />
);
