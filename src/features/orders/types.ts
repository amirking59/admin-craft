export enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled",
}

export interface Order {
  orderId: number;
  customerName: string;
  customerEmail: string;
  product: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
