// database/schema.ts

/**
 * Database Schema for Storekeeper App
 *
 * This file contains SQL schema definitions and migration logic
 */

export const SCHEMA_VERSION = 1;

/**
 * Products Table Schema
 * Stores all product information with SQLite
 */
export const PRODUCTS_TABLE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL DEFAULT 0.0,
    image_uri TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    CHECK (quantity >= 0),
    CHECK (price >= 0)
  );
`;

/**
 * Indexes for better query performance
 */
export const PRODUCTS_INDEXES = `
  CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
  CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_products_updated_at ON products(updated_at DESC);
`;

/**
 * Complete schema with all tables and indexes
 */
export const COMPLETE_SCHEMA = `
  ${PRODUCTS_TABLE_SCHEMA}
  ${PRODUCTS_INDEXES}
`;

/**
 * Sample seed data for testing (optional)
 */
export const SEED_DATA = [
  {
    id: "sample-1",
    name: "Sample Product 1",
    quantity: 10,
    price: 29.99,
    image_uri: null,
  },
  {
    id: "sample-2",
    name: "Sample Product 2",
    quantity: 5,
    price: 49.99,
    image_uri: null,
  },
];

/**
 * Migration functions for future schema updates
 */
export const migrations: { [version: number]: string } = {
  1: COMPLETE_SCHEMA,
  // Future migrations would go here
  // 2: 'ALTER TABLE products ADD COLUMN category TEXT;',
  // 3: 'CREATE TABLE categories (...);',
};

/**
 * Get the migration SQL for a specific version
 */
export const getMigration = (version: number): string => {
  return migrations[version] || "";
};

/**
 * Drop all tables (use with caution, for development only)
 */
export const DROP_ALL_TABLES = `
  DROP TABLE IF EXISTS products;
`;

/**
 * Table names enum for type safety
 */
export enum TableNames {
  PRODUCTS = "products",
}

/**
 * Column names for products table
 */
export enum ProductColumns {
  ID = "id",
  NAME = "name",
  QUANTITY = "quantity",
  PRICE = "price",
  IMAGE_URI = "image_uri",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
}
