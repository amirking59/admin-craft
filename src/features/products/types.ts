/** A product, as the app names DummyJSON's fields. */
export interface Product {
  productId: number;
  name: string;
  description: string;
  /** The category's slug, e.g. "home-decoration". */
  category: string;
  price: number;
  stock: number;
  /** A picture's URL. */
  thumbnail: string;
}

export type CreateProductParams = Omit<Product, "productId" | "thumbnail">;

export interface UpdateProductParams extends CreateProductParams {
  productId: number;
}

export interface Category {
  slug: string;
  name: string;
}
