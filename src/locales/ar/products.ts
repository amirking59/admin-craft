import { ProductCategory } from "@/features/products/types";

export const products = {
  products: "المنتجات",
  product: "منتج",
  productId: "رقم المنتج",
  name: "الاسم",
  description: "الوصف",
  category: "الفئة",
  price: "السعر ($)",
  stock: "المخزون",
  status: "الحالة",
  isActive: "نشط",
  active: "نشط",
  inactive: "غير نشط",
  productCategory: {
    [ProductCategory.Electronics]: "إلكترونيات",
    [ProductCategory.Clothing]: "ملابس",
    [ProductCategory.Books]: "كتب",
    [ProductCategory.Accessories]: "إكسسوارات",
    [ProductCategory.Food]: "طعام",
  },
};
