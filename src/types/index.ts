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

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  created_at: string;
};

// Cart item joined with product and variant data — what the UI actually needs
export type CartItemWithProduct = CartItem & {
  product: ProductWithDetails;
  variant: ProductVariant;
};

// Guest cart item stored in localStorage (no id/user_id needed)
export type GuestCartItem = {
  product_id: string;
  variant_id: string;
  quantity: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type ShippingAddress = {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  pincode: string;
  label: string;
};

export type Order = {
  id: string;
  user_id: string;
  status: OrderStatus;
  address_id: string | null;
  shipping_address: ShippingAddress;
  subtotal: number;
  shipping_fee: number;
  total: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  quantity: number;
  price_at_purchase: number;
  product_name: string;
  variant_label: string;
  created_at: string;
};

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};
