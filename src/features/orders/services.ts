import { m } from "@/paraglide/messages.js";
import { CreateOrderParams, Order, UpdateOrderParams } from "@/features/orders/types";
import { DataTableQueryParams, FilterOption, FilterOptions, TableQueryFnResponse } from "@/components/data-table";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/configs/api";

/** DummyJSON's cart, the fields the app uses. */
interface ApiCart {
  id: number;
  userId: number;
  products: { id: number; title: string; thumbnail: string; price: number; quantity: number }[];
  totalQuantity: number;
  total: number;
  discountedTotal: number;
}

interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const fullName = (user: ApiUser) => `${user.firstName} ${user.lastName}`;

// Every customer, loaded once, as a cart has only its customer's id (a real API would send the name with the order).
let customers: Promise<Map<number, ApiUser>> | null = null;
const getCustomers = () =>
  (customers ??= api<{ users: ApiUser[] }>("/users", { params: { limit: 0, select: "firstName,lastName,email" } })
    .then(({ users }) => new Map(users.map((user) => [user.id, user])))
    .catch((error) => {
      customers = null;
      throw error;
    }));

const fromApi = (cart: ApiCart, users: Map<number, ApiUser>): Order => {
  const customer = users.get(cart.userId);
  return {
    orderId: cart.id,
    customerId: cart.userId,
    customerName: customer ? fullName(customer) : `#${cart.userId}`,
    customerEmail: customer?.email ?? "",
    items: cart.products.map(({ id, title, thumbnail, price, quantity }) => ({
      productId: id,
      title,
      thumbnail,
      price,
      quantity,
    })),
    totalQuantity: cart.totalQuantity,
    total: cart.total,
    discountedTotal: cart.discountedTotal,
  };
};

// The table's sortable columns, as the API names them.
const sortFields: Record<string, string> = {
  orderId: "id",
  items: "totalProducts",
  totalQuantity: "totalQuantity",
  discountedTotal: "discountedTotal",
};

export const getOrders = async ({ page, sort, filters }: DataTableQueryParams): TableQueryFnResponse<Order> => {
  const customer = typeof filters?.customer === "string" ? filters.customer : "";
  const field = sort?.replace(/^-/, "");

  const [{ carts, total }, users] = await Promise.all([
    api<{ carts: ApiCart[]; total: number }>(customer ? `/carts/user/${encodeURIComponent(customer)}` : "/carts", {
      params: {
        limit: page.size,
        skip: (page.index - 1) * page.size,
        sortBy: field && sortFields[field],
        order: sort && (sort.startsWith("-") ? "desc" : "asc"),
      },
    }),
    getCustomers(),
  ]);

  return { items: carts.map((cart) => fromApi(cart, users)), total };
};

/** The customers whose name matches `search`, from the server: the customer filter's options and the form's. */
export const searchCustomers = async (search: string): Promise<FilterOption[]> => {
  const { users } = await api<{ users: ApiUser[] }>("/users/search", {
    params: { q: search, limit: 20, select: "firstName,lastName,email" },
  });
  return users.map((user) => ({ value: String(user.id), label: fullName(user) }));
};

/** The customers matching `search`, as the orders table's customer filter lists them (`FilterDef.useOptions`). */
export const useCustomerOptions = (search: string): FilterOptions => {
  const query = useQuery({
    queryKey: ["customer-options", search],
    queryFn: () => searchCustomers(search),
    // Keep the last results while the next search loads, rather than an empty list.
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
  return { items: query.data ?? [], loading: query.isPending, remote: true };
};

const toApiProducts = (items: CreateOrderParams["items"]) =>
  items.map(({ productId, quantity }) => ({ id: productId, quantity }));

// DummyJSON answers these as if it saved them, but keeps nothing: the list reloads unchanged.
const createOrder = ({ customerId, items }: CreateOrderParams) =>
  api("/carts/add", { method: "POST", body: { userId: customerId, products: toApiProducts(items) } });

// A cart's customer can't change, only its products.
const updateOrder = ({ orderId, items }: UpdateOrderParams) =>
  api(`/carts/${orderId}`, { method: "PUT", body: { merge: false, products: toApiProducts(items) } });

const deleteOrder = (orderId: number) => api(`/carts/${orderId}`, { method: "DELETE" });

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

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(m.update_success());
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(m.delete_success());
    },
  });
};
