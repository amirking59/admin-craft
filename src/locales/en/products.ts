import { ProductCategory } from "@/features/products/types";

export const products = {
  products: "Products",
  product: "Product",
  productId: "Product ID",
  name: "Name",
  description: "Description",
  category: "Category",
  price: "Price ($)",
  stock: "Stock",
  status: "Status",
  isActive: "Active",
  active: "Active",
  inactive: "Inactive",
  productCategory: {
    [ProductCategory.Electronics]: "Electronics",
    [ProductCategory.Clothing]: "Clothing",
    [ProductCategory.Books]: "Books",
    [ProductCategory.Accessories]: "Accessories",
    [ProductCategory.Food]: "Food",
  },
};
