import { m } from "@/paraglide/messages.js";
import { OrderStatus, OrderTag, PaymentMethod } from "@/features/orders/types";

export const statusLabel: Record<OrderStatus, () => string> = {
  [OrderStatus.Pending]: m.orders_order_status_pending,
  [OrderStatus.Processing]: m.orders_order_status_processing,
  [OrderStatus.Shipped]: m.orders_order_status_shipped,
  [OrderStatus.Delivered]: m.orders_order_status_delivered,
  [OrderStatus.Cancelled]: m.orders_order_status_cancelled,
};

export const paymentMethodLabel: Record<PaymentMethod, () => string> = {
  [PaymentMethod.Card]: m.orders_payment_method_card,
  [PaymentMethod.Cash]: m.orders_payment_method_cash,
  [PaymentMethod.Transfer]: m.orders_payment_method_transfer,
};

export const tagLabel: Record<OrderTag, () => string> = {
  [OrderTag.Gift]: m.orders_tag_gift,
  [OrderTag.Express]: m.orders_tag_express,
  [OrderTag.Fragile]: m.orders_tag_fragile,
};
