// src/types/index.ts
export type ProductCategory = "makhana" | "seeds" | "honey";
export type StockStatus = "in_stock" | "out_of_stock";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: ProductCategory;
  price: number;
  weight_label: string;
  stock_status: StockStatus;
  fssai_number: string | null;
  marketing_badges: string[];
  nutrition_info: Record<string, string> | null;
  created_at: string;
  updated_at: string;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size_label: string;
  price: number;
  stock_status: StockStatus;
  created_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

/**
 * Product with its related variants and images joined together —
 * this is the shape returned by our query functions, since the UI
 * almost always needs a product alongside its images/variants
 * rather than the bare row alone.
 */
export type ProductWithDetails = Product & {
  product_variants: ProductVariant[];
  product_images: ProductImage[];
};

export type Address = {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
};
