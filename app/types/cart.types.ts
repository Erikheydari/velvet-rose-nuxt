export interface CartItemCategory {
  name: string;
  slug: string;
}

export interface CartItemAttribute {
  id: number;
  attribute: string;
  value: string;
  name: string;
}

export interface CartItemBrand {
  name: string;
  slug: string | null;
}

export interface CartItemImage {
  src: string;
  alt_image: string | null;
}

export interface CartItemProduct {
  id: number;
  name: string;
  full_name: string;
  price: string;
  discount_percentage: string;
  final_price: string;
  category: CartItemCategory;
  brand: CartItemBrand;
  image: CartItemImage;
  slug: string;
  selected_attributes: CartItemAttribute[];
  qty?: number;
}

export interface CartItem {
  id: number;
  product: CartItemProduct;
  quantity: number;
  final_price: string;
}

export interface CartItemResponse {
  data: CartItem[];
  totalItems: number;
  totalPrice: string;
  totalDiscount: string;
  line_without_total_discount: string;
  line_with_total_discount: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: any;
}
