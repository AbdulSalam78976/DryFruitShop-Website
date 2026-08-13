export type Category = {
  id: string;
  name: string;
  name_urdu: string | null;
  image_url: string | null;
  parent_id: string | null;
  sort_order: number;
};

export type ProductGrade = {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  pricing_unit: "gram" | "unit";
  display_unit: "kg" | "g" | "unit" | "box";
  price: number; // per base unit (gram, or unit)
  reorder_threshold: number;
  image_url: string | null;
  is_active: boolean;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  name_urdu: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  grades: ProductGrade[];
};

export type Bundle = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
};

export type Settings = {
  shop_name: string | null;
  order_number: string | null;
  complaint_number: string | null;
  whatsapp_handle: string | null;
  facebook_handle: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
};
