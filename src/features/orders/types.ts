export enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

export enum PaymentMethod {
  Card = "Card",
  Cash = "Cash",
  Transfer = "Transfer",
}

export enum OrderTag {
  Gift = "Gift",
  Express = "Express",
  Fragile = "Fragile",
}

export interface Order {
  orderId: number;
  customerName: string;
  customerEmail: string;
  product: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paid: boolean;
  tags: OrderTag[];
  createdAt: string;
  /** ISO strings, as DateField's range mode holds them. */
  deliveryWindow: { from: string | null; to: string | null } | null;
  note: string;
}

export type CreateOrderParams = Omit<Order, "orderId">;

export interface UpdateOrderParams extends CreateOrderParams {
  orderId: number;
}
