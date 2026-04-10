import { Order, OrderStatus } from "@/app/(main)/orders/_types";
import { TableQueryFnResponse } from "@/components/data-table/_types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const mockOrders: Order[] = [
  { orderId: 1001, customerName: "Alice Johnson", customerEmail: "alice@example.com", product: 'MacBook Pro 14"', quantity: 1, total: 1999, status: OrderStatus.Delivered, createdAt: "2026-03-15T10:24:00Z" },
  { orderId: 1002, customerName: "Bob Smith", customerEmail: "bob@example.com", product: "AirPods Pro (2nd gen)", quantity: 2, total: 498, status: OrderStatus.Shipped, createdAt: "2026-03-18T14:05:00Z" },
  { orderId: 1003, customerName: "Carol White", customerEmail: "carol@example.com", product: "Atomic Habits", quantity: 3, total: 72, status: OrderStatus.Delivered, createdAt: "2026-03-20T09:10:00Z" },
  { orderId: 1004, customerName: "David Brown", customerEmail: "david@example.com", product: "Nike Air Max 270", quantity: 1, total: 129, status: OrderStatus.Processing, createdAt: "2026-03-25T16:45:00Z" },
  { orderId: 1005, customerName: "Eva Martinez", customerEmail: "eva@example.com", product: "iPhone 15 Pro", quantity: 1, total: 999, status: OrderStatus.Delivered, createdAt: "2026-03-10T11:30:00Z" },
  { orderId: 1006, customerName: "Frank Lee", customerEmail: "frank@example.com", product: "Levi's 501 Jeans", quantity: 2, total: 158, status: OrderStatus.Cancelled, createdAt: "2026-03-22T08:15:00Z" },
  { orderId: 1007, customerName: "Grace Kim", customerEmail: "grace@example.com", product: "Apple Watch Series 9", quantity: 1, total: 499, status: OrderStatus.Shipped, createdAt: "2026-03-28T13:00:00Z" },
  { orderId: 1008, customerName: "Henry Wilson", customerEmail: "henry@example.com", product: "Clean Code", quantity: 5, total: 195, status: OrderStatus.Delivered, createdAt: "2026-03-05T15:20:00Z" },
  { orderId: 1009, customerName: "Iris Chen", customerEmail: "iris@example.com", product: "Sony WH-1000XM5", quantity: 1, total: 349, status: OrderStatus.Processing, createdAt: "2026-04-01T10:00:00Z" },
  { orderId: 1010, customerName: "James Park", customerEmail: "james@example.com", product: "Matcha Green Tea Powder", quantity: 4, total: 128, status: OrderStatus.Pending, createdAt: "2026-04-05T09:30:00Z" },
  { orderId: 1011, customerName: "Karen Taylor", customerEmail: "karen@example.com", product: "Samsung 4K Monitor", quantity: 1, total: 499, status: OrderStatus.Shipped, createdAt: "2026-04-02T14:10:00Z" },
  { orderId: 1012, customerName: "Leo Garcia", customerEmail: "leo@example.com", product: "Protein Bars (12 pack)", quantity: 3, total: 87, status: OrderStatus.Delivered, createdAt: "2026-03-30T16:00:00Z" },
  { orderId: 1013, customerName: "Mia Anderson", customerEmail: "mia@example.com", product: "Keychron Q1 Keyboard", quantity: 1, total: 169, status: OrderStatus.Pending, createdAt: "2026-04-08T11:45:00Z" },
  { orderId: 1014, customerName: "Noah Thompson", customerEmail: "noah@example.com", product: "North Face Puffer Jacket", quantity: 1, total: 299, status: OrderStatus.Cancelled, createdAt: "2026-03-14T07:50:00Z" },
  { orderId: 1015, customerName: "Olivia Davis", customerEmail: "olivia@example.com", product: "Ergonomic Laptop Stand", quantity: 2, total: 98, status: OrderStatus.Delivered, createdAt: "2026-03-27T12:30:00Z" },
  { orderId: 1016, customerName: "Peter Harris", customerEmail: "peter@example.com", product: "Mixed Nuts (1kg)", quantity: 6, total: 132, status: OrderStatus.Processing, createdAt: "2026-04-06T15:20:00Z" },
  { orderId: 1017, customerName: "Quinn Robinson", customerEmail: "quinn@example.com", product: "Design Patterns", quantity: 2, total: 110, status: OrderStatus.Shipped, createdAt: "2026-04-03T10:15:00Z" },
  { orderId: 1018, customerName: "Rachel Lewis", customerEmail: "rachel@example.com", product: "Anker USB-C Hub 10-in-1", quantity: 2, total: 138, status: OrderStatus.Pending, createdAt: "2026-04-09T08:00:00Z" },
  { orderId: 1019, customerName: "Sam Walker", customerEmail: "sam@example.com", product: "Adidas Ultraboost 23", quantity: 1, total: 189, status: OrderStatus.Processing, createdAt: "2026-04-07T14:35:00Z" },
  { orderId: 1020, customerName: "Tina Hall", customerEmail: "tina@example.com", product: "iPad Air M2", quantity: 1, total: 749, status: OrderStatus.Delivered, createdAt: "2026-03-12T09:45:00Z" },
  { orderId: 1021, customerName: "Uma Patel", customerEmail: "uma@example.com", product: "Organic Ethiopian Coffee", quantity: 4, total: 96, status: OrderStatus.Delivered, createdAt: "2026-03-08T11:00:00Z" },
  { orderId: 1022, customerName: "Victor Nguyen", customerEmail: "victor@example.com", product: "AirPods Pro (2nd gen)", quantity: 1, total: 249, status: OrderStatus.Cancelled, createdAt: "2026-04-04T16:50:00Z" },
  { orderId: 1023, customerName: "Wendy Clark", customerEmail: "wendy@example.com", product: "Uniqlo Merino Sweater", quantity: 3, total: 177, status: OrderStatus.Shipped, createdAt: "2026-04-06T09:20:00Z" },
  { orderId: 1024, customerName: "Xavier Scott", customerEmail: "xavier@example.com", product: "The Pragmatic Programmer", quantity: 2, total: 98, status: OrderStatus.Delivered, createdAt: "2026-03-17T14:00:00Z" },
  { orderId: 1025, customerName: "Yara Adams", customerEmail: "yara@example.com", product: "Samsung 4K Monitor", quantity: 1, total: 499, status: OrderStatus.Processing, createdAt: "2026-04-09T13:30:00Z" },
];

export const getOrders = async (params: { take: number; skip: number }): TableQueryFnResponse<Order> => {
  await delay(200);
  return {
    items: mockOrders.slice(params.skip, params.skip + params.take),
    total: mockOrders.length,
  };
};
