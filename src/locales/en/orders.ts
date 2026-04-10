import { OrderStatus } from "@/app/(main)/orders/_types";

export const orders = {
  orders: "Orders",
  order: "Order",
  orderId: "Order ID",
  customer: "Customer",
  product: "Product",
  quantity: "Qty",
  total: "Total",
  status: "Status",
  createdAt: "Created At",
  orderStatus: {
    [OrderStatus.Pending]: "Pending",
    [OrderStatus.Processing]: "Processing",
    [OrderStatus.Shipped]: "Shipped",
    [OrderStatus.Delivered]: "Delivered",
    [OrderStatus.Cancelled]: "Cancelled",
  },
};
