import { initDatabase } from "../database/database";
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../types/product";
import { v4 as uuidv4 } from "uuid";

export class ProductService {
  private static async getDb() {
    return await initDatabase();
  }

  static async getAllProducts(): Promise<Product[]> {
    const db = await this.getDb();
    const result = await db.getAllAsync<Product>(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    return result;
  }

  static async getProductById(id: string): Promise<Product | null> {
    const db = await this.getDb();
    const result = await db.getFirstAsync<Product>(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    return result;
  }

  static async createProduct(input: CreateProductInput): Promise<Product> {
    const db = await this.getDb();
    const id = uuidv4();
    const now = Date.now();

    await db.runAsync(
      "INSERT INTO products (id, name, quantity, price, image_uri, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        input.name,
        input.quantity,
        input.price,
        input.image_uri || null,
        now,
        now,
      ]
    );

    return {
      id,
      ...input,
      created_at: now,
      updated_at: now,
    };
  }

  static async updateProduct(
    id: string,
    input: UpdateProductInput
  ): Promise<void> {
    const db = await this.getDb();
    const now = Date.now();

    const updates: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      updates.push("name = ?");
      values.push(input.name);
    }
    if (input.quantity !== undefined) {
      updates.push("quantity = ?");
      values.push(input.quantity);
    }
    if (input.price !== undefined) {
      updates.push("price = ?");
      values.push(input.price);
    }
    if (input.image_uri !== undefined) {
      updates.push("image_uri = ?");
      values.push(input.image_uri);
    }

    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE products SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
  }

  static async deleteProduct(id: string): Promise<void> {
    const db = await this.getDb();
    await db.runAsync("DELETE FROM products WHERE id = ?", [id]);
  }
}
