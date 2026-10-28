import { m } from "@/paraglide/messages.js";
import { DataTable, DataTableFeatures, FilterDef, FilterOperator } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getOrders, orderCustomers } from "@/features/orders/services";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { Order, OrderStatus, OrderTag, PaymentMethod } from "@/features/orders/types";
import { paymentMethodLabel, statusLabel, tagLabel } from "@/features/orders/labels";
import { OrderForm } from "@/features/orders/components/order-form";
import { DialogButton } from "@/components/dialog-button";
import { NumberField } from "@/components/form/number-field";
import { TextField } from "@/components/form/text-field";

const statusVariant: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  [OrderStatus.Pending]: "secondary",
  [OrderStatus.Processing]: "outline",
  [OrderStatus.Shipped]: "default",
  [OrderStatus.Delivered]: "default",
  [OrderStatus.Cancelled]: "destructive",
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
    id: "payment",
    header: m.orders_payment(),
    cell: ({ row }) => (
      <div>
        <div>{paymentMethodLabel[row.original.paymentMethod]()}</div>
        <div className="text-xs text-muted-foreground">{row.original.paid ? m.orders_paid() : m.orders_unpaid()}</div>
      </div>
    ),
    size: 130,
  },
  {
    accessorKey: "createdAt",
    header: m.orders_created_at(),
    enableSorting: true,
    cell: ({ row }) => <span>{dayjs(row.original.createdAt).format("YYYY/MM/DD")}</span>,
    size: 120,
  },
];

// One of each kind, to try the filter bar with: a pinned search, lists (several picks, one pick, a long one to
// search), a date, a number and free text.
const filters: FilterDef[] = [
  {
    name: "q",
    label: m.search,
    pinned: true,
    operator: FilterOperator.Like,
    input: () => <TextField placeholder={m.orders_search()} clearable />,
  },
  {
    name: "status",
    label: m.orders_status,
    operator: FilterOperator.Equal,
    options: () => Object.values(OrderStatus).map((status) => ({ value: status, label: statusLabel[status]() })),
  },
  {
    name: "customer",
    label: m.orders_customer,
    operator: FilterOperator.Equal,
    options: () => orderCustomers.map((name) => ({ value: name, label: name })),
  },
  {
    name: "payment_method",
    label: m.orders_payment,
    operator: FilterOperator.Equal,
    multiple: false,
    options: () =>
      Object.values(PaymentMethod).map((method) => ({ value: method, label: paymentMethodLabel[method]() })),
  },
  {
    name: "paid",
    label: m.orders_payment_status,
    operator: FilterOperator.Equal,
    multiple: false,
    options: () => [
      { value: "true", label: m.orders_paid() },
      { value: "false", label: m.orders_unpaid() },
    ],
  },
  {
    name: "tags",
    label: m.orders_tags,
    operator: FilterOperator.Equal,
    options: () => Object.values(OrderTag).map((tag) => ({ value: tag, label: tagLabel[tag]() })),
  },
  {
    name: "created_at_from",
    label: m.orders_created_from,
    operator: FilterOperator.BetweenDate,
    date: true,
  },
  {
    name: "total_min",
    label: m.orders_total_min,
    operator: FilterOperator.Equal,
    formatValue: (value) => `$${formatNumber(Number(value))}`,
    input: () => <NumberField thousandSeparator placeholder={m.orders_total_min()} />,
  },
  {
    name: "product",
    label: m.orders_product_contains,
    operator: FilterOperator.Like,
    input: () => <TextField placeholder={m.orders_product_contains()} clearable />,
  },
];

export const OrderTable = () => (
  <DataTable
    queryKey="orders"
    queryFn={getOrders}
    columns={columns}
    filters={filters}
    title={m.orders_title()}
    actions={[
      <DialogButton
        key="createOrder"
        variant="outline"
        icon={Plus}
        title={m.add_item({ item: m.orders_order() })}
        dialogClassName="sm:max-w-2xl"
        content={(close) => <OrderForm onClose={close} />}
      />,
    ]}
    initialSort={{ desc: true, id: "orderId" }}
    rowHeight={61}
  />
);
