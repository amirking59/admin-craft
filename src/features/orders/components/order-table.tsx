import { m } from "@/paraglide/messages.js";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash2 } from "lucide-react";
import { DataTable, DataTableFeatures, FilterDef } from "@/components/data-table";
import { ConfirmDialogButton } from "@/components/confirm-dialog-button";
import { DialogButton } from "@/components/dialog-button";
import { formatNumber } from "@/lib/utils";
import { Order } from "@/features/orders/types";
import { getOrders, useCustomerOptions, useDeleteOrder } from "@/features/orders/services";
import { OrderForm } from "@/features/orders/components/order-form";

// DummyJSON filters carts by customer only.
const filters: FilterDef[] = [
  { name: "customer", label: m.orders_customer, type: "select", useOptions: useCustomerOptions },
];

export const OrderTable = () => {
  const { mutateAsync: deleteOrder } = useDeleteOrder();

  // Must be stable: cells render as components (see DataTable), and the delete dialog's state lives in one.
  const columns = useMemo<ColumnDef<DataTableFeatures, Order>[]>(
    () => [
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
        size: 220,
      },
      {
        id: "items",
        header: m.orders_items(),
        enableSorting: true,
        // A few of its products' pictures, and how many products.
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 rtl:space-x-reverse">
              {row.original.items.slice(0, 3).map((item) => (
                <img
                  key={item.productId}
                  src={item.thumbnail}
                  alt=""
                  loading="lazy"
                  className="size-8 rounded-full bg-muted object-cover ring-2 ring-background"
                />
              ))}
            </div>
            <span className="text-muted-foreground">{m.orders_x_products({ x: row.original.items.length })}</span>
          </div>
        ),
        meta: {
          tooltip: (context) => context.row.original.items.map((item) => `${item.quantity} × ${item.title}`).join(", "),
        },
        size: 220,
      },
      {
        accessorKey: "totalQuantity",
        header: m.orders_quantity(),
        enableSorting: true,
        size: 80,
      },
      {
        accessorKey: "discountedTotal",
        header: m.orders_total(),
        enableSorting: true,
        // What's paid, and the price before discounts when there were any.
        cell: ({ row }) => (
          <div>
            <div className="font-medium">${formatNumber(row.original.discountedTotal, 2)}</div>
            {row.original.discountedTotal < row.original.total && (
              <div className="text-xs text-muted-foreground line-through">${formatNumber(row.original.total, 2)}</div>
            )}
          </div>
        ),
        size: 120,
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
              aria-label={m.update_item({ item: m.orders_order() })}
              content={(close) => <OrderForm prevData={row.original} onClose={close} />}
            />
            <ConfirmDialogButton
              size="icon"
              variant="ghost"
              icon={Trash2}
              aria-label={m.delete_item({ item: m.orders_order() })}
              onOk={() => deleteOrder(row.original.orderId)}
            />
          </div>
        ),
      },
    ],
    [deleteOrder],
  );

  return (
    <DataTable
      queryKey="orders"
      queryFn={getOrders}
      columns={columns}
      filters={filters}
      title={m.orders_title()}
      actions={[
        <DialogButton
          key="createOrder"
          size="sm"
          icon={Plus}
          title={m.add_item({ item: m.orders_order() })}
          content={(close) => <OrderForm onClose={close} />}
        />,
      ]}
      initialSort={{ desc: false, id: "orderId" }}
      rowHeight={61}
    />
  );
};
