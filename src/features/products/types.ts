export enum ProductCategory {
  Electronics = "Electronics",
  Clothing = "Clothing",
  Books = "Books",
  Accessories = "Accessories",
  Food = "Food",
}

export interface Product {
  productId: number;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface CreateProductParams {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface UpdateProductParams extends CreateProductParams {
  productId: number;
}
