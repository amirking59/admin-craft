import { m } from "@/paraglide/messages.js";
import { Category, CreateProductParams, Product, UpdateProductParams } from "@/features/products/types";
import { DataTableQueryParams, FilterOptions, TableQueryFnResponse } from "@/components/data-table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/configs/api";

/** DummyJSON's product, the fields the app uses. */
interface ApiProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
}

const fromApi = ({ id, title, ...rest }: ApiProduct): Product => ({ productId: id, name: title, ...rest });
const toApi = ({ name, ...rest }: CreateProductParams) => ({ title: name, ...rest });

// The table's sortable columns, as the API names them.
const sortFields: Record<string, string> = { productId: "id", name: "title", price: "price", stock: "stock" };

export const getProducts = async ({ page, sort, filters }: DataTableQueryParams): TableQueryFnResponse<Product> => {
  const category = typeof filters?.category === "string" ? filters.category : "";
  const q = typeof filters?.q === "string" ? filters.q.trim() : "";
  const field = sort?.replace(/^-/, "");

  // DummyJSON lists one category or searches, not both; the filter bar keeps one of them at a time.
  const { products, total } = await api<{ products: ApiProduct[]; total: number }>(
    category ? `/products/category/${encodeURIComponent(category)}` : q ? "/products/search" : "/products",
    {
      params: {
        q: !category && q ? q : undefined,
        limit: page.size,
        skip: (page.index - 1) * page.size,
        sortBy: field && sortFields[field],
        order: sort && (sort.startsWith("-") ? "desc" : "asc"),
        select: "title,description,category,price,stock,thumbnail",
      },
    },
  );

  return { items: products.map(fromApi), total };
};

/** The products whose name matches `search`, a few at a time: to pick one, e.g. for an order. */
export const searchProducts = async (search: string) => {
  const { products } = await api<{ products: ApiProduct[] }>("/products/search", {
    params: { q: search, limit: 10, select: "title,thumbnail,price" },
  });
  return products;
};

const getCategories = () => api<Category[]>("/products/categories");

export const useCategories = () =>
  useQuery({ queryKey: ["product-categories"], queryFn: getCategories, staleTime: Infinity });

/**
 * The categories as the products table's category filter lists them (`FilterDef.useOptions`). The API has no search
 * for them, so the whole short list loads once and the filter matches it as you type.
 */
export const useCategoryOptions = (): FilterOptions => {
  const { data, isPending } = useCategories();
  return { items: data?.map((category) => ({ value: category.slug, label: category.name })) ?? [], loading: isPending };
};

// DummyJSON answers these as if it saved them, but keeps nothing: the list reloads unchanged.
const createProduct = (data: CreateProductParams) => api("/products/add", { method: "POST", body: toApi(data) });

const updateProduct = ({ productId, ...data }: UpdateProductParams) =>
  api(`/products/${productId}`, { method: "PUT", body: toApi(data) });

const deleteProduct = (productId: number) => api(`/products/${productId}`, { method: "DELETE" });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(m.add_success());
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(m.update_success());
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(m.delete_success());
    },
  });
};
