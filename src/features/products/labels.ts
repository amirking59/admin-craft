import { m } from "@/paraglide/messages.js";
import { ProductCategory } from "@/features/products/types";

export const categoryLabel: Record<ProductCategory, () => string> = {
  [ProductCategory.Electronics]: m.products_product_category_electronics,
  [ProductCategory.Clothing]: m.products_product_category_clothing,
  [ProductCategory.Books]: m.products_product_category_books,
  [ProductCategory.Accessories]: m.products_product_category_accessories,
  [ProductCategory.Food]: m.products_product_category_food,
};
