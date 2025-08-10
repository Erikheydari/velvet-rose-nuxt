export interface CartItem {
    product_id: number;
    quantity: number;
    attributes: string[];
  }
  
  export interface CartItemResponse extends CartItem {
    id: number;
    product?: any;
  }
  
  export interface ApiResponse<T = any> {
    data?: T;
    error?: any;
  }
  