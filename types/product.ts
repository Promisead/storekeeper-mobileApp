export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image_uri?: string;
  created_at: number;
  updated_at: number;
}

export type CreateProductInput = Omit<
  Product,
  "id" | "created_at" | "updated_at"
>;
export type UpdateProductInput = Partial<CreateProductInput>;
