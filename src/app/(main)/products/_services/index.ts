import { Product, ProductCategory, CreateProductParams, UpdateProductParams } from "@/app/(main)/products/_types";
import { TableQueryFnResponse } from "@/components/data-table/_types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let mockProducts: Product[] = [
  {
    productId: 1,
    name: 'MacBook Pro 14"',
    description: "Apple M3 Pro chip, 18GB RAM, 512GB SSD",
    category: ProductCategory.Electronics,
    price: 1999,
    stock: 45,
    isActive: true,
  },
  {
    productId: 2,
    name: "iPhone 15 Pro",
    description: "A17 Pro chip, 256GB, Titanium design",
    category: ProductCategory.Electronics,
    price: 999,
    stock: 120,
    isActive: true,
  },
  {
    productId: 3,
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise cancellation headphones",
    category: ProductCategory.Electronics,
    price: 349,
    stock: 62,
    isActive: true,
  },
  {
    productId: 4,
    name: "iPad Air M2",
    description: "11-inch Liquid Retina display, 256GB",
    category: ProductCategory.Electronics,
    price: 749,
    stock: 38,
    isActive: true,
  },
  {
    productId: 5,
    name: "Samsung 4K Monitor",
    description: '27" 4K UHD IPS display, 144Hz',
    category: ProductCategory.Electronics,
    price: 499,
    stock: 30,
    isActive: true,
  },
  {
    productId: 6,
    name: "Levi's 501 Jeans",
    description: "Classic straight-leg denim jeans",
    category: ProductCategory.Clothing,
    price: 79,
    stock: 200,
    isActive: true,
  },
  {
    productId: 7,
    name: "Nike Air Max 270",
    description: "Lightweight running shoes with Air cushioning",
    category: ProductCategory.Clothing,
    price: 129,
    stock: 150,
    isActive: true,
  },
  {
    productId: 8,
    name: "North Face Puffer Jacket",
    description: "600-fill down insulation, waterproof",
    category: ProductCategory.Clothing,
    price: 299,
    stock: 75,
    isActive: true,
  },
  {
    productId: 9,
    name: "Adidas Ultraboost 23",
    description: "Premium running shoes with Boost midsole",
    category: ProductCategory.Clothing,
    price: 189,
    stock: 95,
    isActive: true,
  },
  {
    productId: 10,
    name: "Uniqlo Merino Sweater",
    description: "100% merino wool, machine washable",
    category: ProductCategory.Clothing,
    price: 59,
    stock: 175,
    isActive: true,
  },
  {
    productId: 11,
    name: "Clean Code",
    description: "A Handbook of Agile Software Craftsmanship by Robert Martin",
    category: ProductCategory.Books,
    price: 39,
    stock: 85,
    isActive: true,
  },
  {
    productId: 12,
    name: "The Pragmatic Programmer",
    description: "Your Journey to Mastery, 20th Anniversary Edition",
    category: ProductCategory.Books,
    price: 49,
    stock: 72,
    isActive: true,
  },
  {
    productId: 13,
    name: "Atomic Habits",
    description: "Tiny Changes, Remarkable Results by James Clear",
    category: ProductCategory.Books,
    price: 24,
    stock: 130,
    isActive: true,
  },
  {
    productId: 14,
    name: "Design Patterns",
    description: "Elements of Reusable Object-Oriented Software",
    category: ProductCategory.Books,
    price: 55,
    stock: 48,
    isActive: true,
  },
  {
    productId: 15,
    name: "Sapiens",
    description: "A Brief History of Humankind by Yuval Noah Harari",
    category: ProductCategory.Books,
    price: 18,
    stock: 95,
    isActive: true,
  },
  {
    productId: 16,
    name: "Apple Watch Series 9",
    description: "45mm GPS + Cellular, braided solo loop",
    category: ProductCategory.Accessories,
    price: 499,
    stock: 60,
    isActive: true,
  },
  {
    productId: 17,
    name: "AirPods Pro (2nd gen)",
    description: "Active Noise Cancellation, Adaptive Audio",
    category: ProductCategory.Accessories,
    price: 249,
    stock: 110,
    isActive: true,
  },
  {
    productId: 18,
    name: "Anker USB-C Hub 10-in-1",
    description: "4K HDMI, 100W PD charging, SD card reader",
    category: ProductCategory.Accessories,
    price: 69,
    stock: 215,
    isActive: true,
  },
  {
    productId: 19,
    name: "Ergonomic Laptop Stand",
    description: 'Adjustable aluminum stand, 10–15" device support',
    category: ProductCategory.Accessories,
    price: 49,
    stock: 180,
    isActive: true,
  },
  {
    productId: 20,
    name: "Keychron Q1 Keyboard",
    description: "75% hot-swappable mechanical keyboard, aluminum",
    category: ProductCategory.Accessories,
    price: 169,
    stock: 88,
    isActive: true,
  },
  {
    productId: 21,
    name: "Organic Ethiopian Coffee",
    description: "Single origin, medium roast, 500g bag",
    category: ProductCategory.Food,
    price: 24,
    stock: 300,
    isActive: true,
  },
  {
    productId: 22,
    name: "Matcha Green Tea Powder",
    description: "Ceremonial grade, 100g tin",
    category: ProductCategory.Food,
    price: 32,
    stock: 180,
    isActive: true,
  },
  {
    productId: 23,
    name: "Mixed Nuts (1kg)",
    description: "Almonds, cashews, walnuts – unsalted",
    category: ProductCategory.Food,
    price: 22,
    stock: 250,
    isActive: true,
  },
  {
    productId: 24,
    name: "Protein Bars (12 pack)",
    description: "Chocolate peanut butter, 20g protein each",
    category: ProductCategory.Food,
    price: 29,
    stock: 320,
    isActive: true,
  },
  {
    productId: 25,
    name: "Wireless Backup Charger",
    description: "10000mAh, Qi wireless + USB-C",
    category: ProductCategory.Electronics,
    price: 49,
    stock: 0,
    isActive: false,
  },
];

let nextId = 26;

export const getProducts = async (params: { take: number; skip: number }): TableQueryFnResponse<Product> => {
  await delay(200);
  return {
    items: mockProducts.slice(params.skip, params.skip + params.take),
    total: mockProducts.length,
  };
};

export const createProduct = async (data: CreateProductParams): Promise<void> => {
  await delay(300);
  mockProducts.unshift({ ...data, productId: nextId++ });
};

export const updateProduct = async (data: UpdateProductParams): Promise<void> => {
  await delay(300);
  const idx = mockProducts.findIndex((p) => p.productId === data.productId);
  if (idx !== -1) mockProducts[idx] = { ...mockProducts[idx], ...data };
};

export const deleteProduct = async (productId: number): Promise<void> => {
  await delay(200);
  mockProducts = mockProducts.filter((p) => p.productId !== productId);
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(t("addSuccess"));
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(t("updateSuccess"));
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(t("deleteSuccess"));
    },
  });
};
