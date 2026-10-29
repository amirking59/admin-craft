/** A line of an order: a product, and how many. */
export interface OrderItem {
  productId: number;
  title: string;
  /** A picture's URL. */
  thumbnail: string;
  price: number;
  quantity: number;
}

/** An order: a DummyJSON cart, with its customer's name. */
export interface Order {
  orderId: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalQuantity: number;
  /** Before discounts. */
  total: number;
  /** After discounts: what's paid. */
  discountedTotal: number;
}

export interface CreateOrderParams {
  customerId: number;
  items: Pick<OrderItem, "productId" | "quantity">[];
}

export interface UpdateOrderParams extends CreateOrderParams {
  orderId: number;
}
