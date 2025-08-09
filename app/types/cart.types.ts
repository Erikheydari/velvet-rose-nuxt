export interface CartItem {
    product_id: number;
    quantity: number;
    attributes: string[];
  }
  
  export interface CartItemResponse extends CartItem {
    id?: number;
    product?: any; // Add product details if returned by API
    // Add other fields returned by your API
  }
  
  export interface ApiResponse<T = any> {
    data?: T;
    error?: any;
  }
  