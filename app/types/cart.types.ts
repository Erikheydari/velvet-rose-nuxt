export interface CartItemCategory {
  name: string;
  slug: string;
}

export interface CartItemAttribute {
  readonly id: number;
  readonly attribute: string;
  readonly value: string;
  readonly name: string;
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
  readonly selected_attributes: ReadonlyArray<CartItemAttribute>;
  qty?: number;
}

export interface CartItemAdd {
  product_id: number;
  quantity: number;
  attributes: string[];
}

export interface CartItem {
  id: number;
  product: CartItemProduct;
  quantity: number;
  line_total_without_discount: string;
  line_total_with_discount: string;
}

export interface Cart {
  data: CartItem[];
}

export interface CartItemResponse {
  data: CartItem[];
  totalItems?: number;
  totalPrice?: string;
  totalDiscount?: string;
  line_without_total_discount?: string;
  line_with_total_discount?: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: any;
}
