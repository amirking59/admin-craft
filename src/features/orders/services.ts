import { m } from "@/paraglide/messages.js";
import { CreateOrderParams, Order, OrderStatus, OrderTag, PaymentMethod } from "@/features/orders/types";
import { DataTableQueryParams, TableQueryFnResponse } from "@/components/data-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import dayjs from "dayjs";
import { delay, sortRows } from "@/lib/mock";

type SeedOrder = Omit<Order, "paymentMethod" | "paid" | "tags" | "deliveryWindow" | "note">;

const seedOrders: SeedOrder[] = [
  {
    orderId: 1001,
    customerName: "Alice Johnson",
    customerEmail: "alice@example.com",
    product: 'MacBook Pro 14"',
    quantity: 1,
    total: 1999,
    status: OrderStatus.Delivered,
    createdAt: "2026-03-15T10:24:00Z",
  },
  {
    orderId: 1002,
    customerName: "Bob Smith",
    customerEmail: "bob@example.com",
    product: "AirPods Pro (2nd gen)",
    quantity: 2,
    total: 498,
    status: OrderStatus.Shipped,
    createdAt: "2026-03-18T14:05:00Z",
  },
  {
    orderId: 1003,
    customerName: "Carol White",
    customerEmail: "carol@example.com",
    product: "Atomic Habits",
    quantity: 3,
    total: 72,
    status: OrderStatus.Delivered,
    createdAt: "2026-03-20T09:10:00Z",
  },
  {
    orderId: 1004,
    customerName: "David Brown",
    customerEmail: "david@example.com",
    product: "Nike Air Max 270",
    quantity: 1,
    total: 129,
    status: OrderStatus.Processing,
    createdAt: "2026-03-25T16:45:00Z",
  },
  {
    orderId: 1005,
    customerName: "Eva Martinez",
    customerEmail: "eva@example.com",
    product: "iPhone 15 Pro",
    quantity: 1,
    total: 999,
    status: OrderStatus.Delivered,
    createdAt: "2026-03-10T11:30:00Z",
  },
  {
    orderId: 1006,
    customerName: "Frank Lee",
    customerEmail: "frank@example.com",
    product: "Levi's 501 Jeans",
    quantity: 2,
    total: 158,
    status: OrderStatus.Cancelled,
    createdAt: "2026-03-22T08:15:00Z",
  },
  {
    orderId: 1007,
    customerName: "Grace Kim",
    customerEmail: "grace@example.com",
    product: "Apple Watch Series 9",
    quantity: 1,
    total: 499,
    status: OrderStatus.Shipped,
    createdAt: "2026-03-28T13:00:00Z",
  },
  {
    orderId: 1008,
    customerName: "Henry Wilson",
    customerEmail: "henry@example.com",
    product: "Clean Code",
    quantity: 5,
    total: 195,
    status: OrderStatus.Delivered,
    createdAt: "2026-03-05T15:20:00Z",
  },
  {
    orderId: 1009,
    customerName: "Iris Chen",
    customerEmail: "iris@example.com",
    product: "Sony WH-1000XM5",
    quantity: 1,
    total: 349,
    status: OrderStatus.Processing,
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    orderId: 1010,
    customerName: "James Park",
    customerEmail: "james@example.com",
    product: "Matcha Green Tea Powder",
    quantity: 4,
    total: 128,
    status: OrderStatus.Pending,
    createdAt: "2026-04-05T09:30:00Z",
  },
  {
    orderId: 1011,
    customerName: "Karen Taylor",
    customerEmail: "karen@example.com",
    product: "Samsung 4K Monitor",
    quantity: 1,
    total: 499,
    status: OrderStatus.Shipped,
    createdAt: "2026-04-02T14:10:00Z",
  },
  {
    orderId: 1012,
    customerName: "Leo Garcia",
    customerEmail: "leo@example.com",
    product: "Protein Bars (12 pack)",
    quantity: 3,
    total: 87,
    status: OrderStatus.Delivered,
    createdAt: "2026-03-30T16:00:00Z",
  },
  {
    orderId: 1013,
    customerName: "Mia Anderson",
    customerEmail: "mia@example.com",
    product: "Keychron Q1 Keyboard",
    quantity: 1,
    total: 169,
    status: OrderStatus.Pending,
    createdAt: "2026-04-08T11:45:00Z",
  },
  {
    orderId: 1014,
    customerName: "Noah Thompson",
    customerEmail: "noah@example.com",
    product: "North Face Puffer Jacket",
    quantity: 1,
    total: 299,
    status: OrderStatus.Cancelled,
    createdAt: "2026-03-14T07:50:00Z",
  },
  {
    orderId: 1015,
    customerName: "Olivia Davis",
    customerEmail: "olivia@example.com",
    product: "Ergonomic Laptop Stand",
    quantity: 2,
    total: 98,
    status: OrderStatus.Delivered,
    createdAt: "2026-03-27T12:30:00Z",
  },
  {
    orderId: 1016,
    customerName: "Peter Harris",
    customerEmail: "peter@example.com",
    product: "Mixed Nuts (1kg)",
    quantity: 6,
    total: 132,
    status: OrderStatus.Processing,
    createdAt: "2026-04-06T15:20:00Z",
  },
  {
    orderId: 1017,
    customerName: "Quinn Robinson",
    customerEmail: "quinn@example.com",
    product: "Design Patterns",
    quantity: 2,
    total: 110,
    status: OrderStatus.Shipped,
    createdAt: "2026-04-03T10:15:00Z",
  },
  {
    orderId: 1018,
    customerName: "Rachel Lewis",
    customerEmail: "rachel@example.com",
    product: "Anker USB-C Hub 10-in-1",
    quantity: 2,
    total: 138,
    status: OrderStatus.Pending,
    createdAt: "2026-04-09T08:00:00Z",
  },
  {
    orderId: 1019,
    customerName: "Sam Walker",
    customerEmail: "sam@example.com",
    product: "Adidas Ultraboost 23",
    quantity: 1,
    total: 189,
    status: OrderStatus.Processing,
    createdAt: "2026-04-07T14:35:00Z",
  },
  {
    orderId: 1020,
    customerName: "Tina Hall",
    customerEmail: "tina@example.com",
    product: "iPad Air M2",
    quantity: 1,
    total: 749,
    status: OrderStatus.Delivered,
    createdAt: "2026-03-12T09:45:00Z",
  },
  {
    orderId: 1021,
    customerName: "Uma Patel",
    customerEmail: "uma@example.com",
    product: "Organic Ethiopian Coffee",
    quantity: 4,
    total: 96,
    status: OrderStatus.Delivered,
    createdAt: "2026-03-08T11:00:00Z",
  },
  {
    orderId: 1022,
    customerName: "Victor Nguyen",
    customerEmail: "victor@example.com",
    product: "AirPods Pro (2nd gen)",
    quantity: 1,
    total: 249,
    status: OrderStatus.Cancelled,
    createdAt: "2026-04-04T16:50:00Z",
  },
  {
    orderId: 1023,
    customerName: "Wendy Clark",
    customerEmail: "wendy@example.com",
    product: "Uniqlo Merino Sweater",
    quantity: 3,
    total: 177,
    status: OrderStatus.Shipped,
    createdAt: "2026-04-06T09:20:00Z",
  },
  {
    orderId: 1024,
    customerName: "Xavier Scott",
    customerEmail: "xavier@example.com",
    product: "The Pragmatic Programmer",
    quantity: 2,
    total: 98,
    status: OrderStatus.Delivered,
    createdAt: "2026-03-17T14:00:00Z",
  },
  {
    orderId: 1025,
    customerName: "Yara Adams",
    customerEmail: "yara@example.com",
    product: "Samsung 4K Monitor",
    quantity: 1,
    total: 499,
    status: OrderStatus.Processing,
    createdAt: "2026-04-09T13:30:00Z",
  },
];

// The fields the seed rows leave out, spread over them so every filter has something to find.
const paymentMethods = Object.values(PaymentMethod);
const mockOrders: Order[] = seedOrders.map((order, index) => ({
  ...order,
  paymentMethod: paymentMethods[index % paymentMethods.length],
  paid: order.status !== OrderStatus.Pending && order.status !== OrderStatus.Cancelled,
  tags: index % 4 === 0 ? [OrderTag.Gift] : index % 5 === 0 ? [OrderTag.Express, OrderTag.Fragile] : [],
  deliveryWindow: null,
  note: "",
}));

/** The customers and products in the mock orders, for the customer filter and the order form's product list. */
export const orderCustomers = [...new Set(seedOrders.map((order) => order.customerName))].toSorted();
export const orderProducts = [...new Set(seedOrders.map((order) => order.product))].toSorted();

// A filter value is a string or, from a multi-pick, a list of them.
const asList = (value: string | string[] | undefined) => (value === undefined ? [] : [value].flat());

export const getOrders = async ({ page, sort, filters }: DataTableQueryParams): TableQueryFnResponse<Order> => {
  await delay(200);

  const statuses = asList(filters?.status);
  const customers = asList(filters?.customer);
  const tags = asList(filters?.tags);
  const paymentMethod = filters?.payment_method;
  const paid = filters?.paid;
  const createdAtFrom = typeof filters?.created_at_from === "string" ? filters.created_at_from : undefined;
  const totalMin = filters?.total_min ? Number(filters.total_min) : undefined;
  const product = typeof filters?.product === "string" ? filters.product.trim().toLowerCase() : "";
  const query = typeof filters?.q === "string" ? filters.q.trim().toLowerCase() : "";

  const filtered = mockOrders.filter((order) => {
    if (statuses.length > 0 && !statuses.includes(order.status)) return false;
    if (customers.length > 0 && !customers.includes(order.customerName)) return false;
    if (tags.length > 0 && !tags.some((tag) => order.tags.includes(tag as OrderTag))) return false;
    if (paymentMethod && order.paymentMethod !== paymentMethod) return false;
    if (paid && String(order.paid) !== paid) return false;
    if (createdAtFrom && dayjs(order.createdAt).isBefore(dayjs(createdAtFrom))) return false;
    if (totalMin !== undefined && order.total < totalMin) return false;
    if (product && !order.product.toLowerCase().includes(product)) return false;
    if (query && ![order.customerName, order.customerEmail, order.product].some((s) => s.toLowerCase().includes(query)))
      return false;
    return true;
  });

  const skip = (page.index - 1) * page.size;

  return {
    items: sortRows(filtered, sort).slice(skip, skip + page.size),
    total: filtered.length,
  };
};

const createOrder = async (params: CreateOrderParams) => {
  await delay(400);
  const order = { ...params, orderId: Math.max(...mockOrders.map((o) => o.orderId)) + 1 };
  mockOrders.push(order);
  return order;
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(m.add_success());
    },
  });
};
