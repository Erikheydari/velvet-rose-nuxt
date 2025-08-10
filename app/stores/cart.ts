// stores/cart.ts
import { defineStore } from 'pinia';
import { useApiStore } from '@/stores/api';
import { useEndpointStore } from '@/stores/endpoints';
import type { CartItem, CartItemResponse, ApiResponse } from '~/types/cart.types';

export const useCartStore = defineStore('cart', () => {
  const apiStore = useApiStore();
  const endpointStore = useEndpointStore();

  // State
  const cartItems = ref<CartItemResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const justAdded = ref<boolean>(false);

  // Actions
  const addToCart = async (cartData: CartItem): Promise<ApiResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await apiStore.apiRequest(endpointStore.cart.add, {
        method: 'post',
        body: cartData
      });

      if (apiError) {
        error.value = 'Failed to add item to cart';
        return { error: apiError };
      }

      // Refresh cart after adding item
      await fetchCart();

      // flip justAdded for reactive UI effects
      justAdded.value = true;
      setTimeout(() => (justAdded.value = false), 500);

      return { data };
    } catch (err: any) {
      error.value = err.message || 'Failed to add item to cart';
      return { error: err };
    } finally {
      loading.value = false;
    }
  };

  const fetchCart = async (): Promise<ApiResponse<CartItemResponse[]>> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await apiStore.apiRequest(endpointStore.cart.get, {
        method: 'get'
      });

      if (apiError) {
        error.value = 'Failed to fetch cart';
        return { error: apiError };
      }

      // Ensure data is an array before assigning
      if (Array.isArray(data)) {
        cartItems.value = data;
      } else if (data && typeof data === 'object' && 'items' in data) {
        // If API returns { items: [...] }
        cartItems.value = data.items || [];
      } else {
        // If data is not an array, initialize as empty array
        cartItems.value = [];
      }

      return { data: cartItems.value };
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch cart';
      cartItems.value = []; // Ensure it's always an array
      return { error: err };
    } finally {
      loading.value = false;
    }
  };

  const removeFromCart = async (itemId: number): Promise<ApiResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await apiStore.apiRequest(endpointStore.cart.remove(itemId), {
        method: 'delete',
      });

      if (apiError) {
        error.value = 'Failed to remove item from cart';
        return { error: apiError };
      }

      // Refresh cart after removing item
      await fetchCart();

      return { data };
    } catch (err: any) {
      error.value = err.message || 'Failed to remove item from cart';
      return { error: err };
    } finally {
      loading.value = false;
    }
  };

  const updateCartItem = async (itemId: number, quantity: number): Promise<ApiResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await apiStore.apiRequest(endpointStore.cart.update(itemId), {
        method: 'put',
        body: { quantity }
      });

      if (apiError) {
        error.value = 'Failed to update cart item';
        return { error: apiError };
      }

      // Refresh cart after updating item
      await fetchCart();

      return { data };
    } catch (err: any) {
      error.value = err.message || 'Failed to update cart item';
      return { error: err };
    } finally {
      loading.value = false;
    }
  };

  const increaseCartItem = async (itemId: number, quantity: number): Promise<ApiResponse> => {
    return await updateCartItem(itemId, quantity + 1);
  };

  const decreaseCartItem = async (itemId: number, quantity: number): Promise<ApiResponse> => {
    return await updateCartItem(itemId, quantity - 1);
  };

  // New: request password reset using auth endpoint
  const requestPasswordReset = async (email: string): Promise<ApiResponse> => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: apiError } = await apiStore.apiRequest(endpointStore.auth.forgotPassword, {
        method: 'post',
        body: { email }
      });

      if (apiError) {
        error.value = apiError;
        return { error: apiError };
      }

      return { data };
    } catch (err: any) {
      error.value = err.message || 'Failed to request password reset';
      return { error: err };
    } finally {
      loading.value = false;
    }
  };

  const clearCart = async (): Promise<ApiResponse> => {
    loading.value = true;
    error.value = null;

    for (const item of cartItems.value) {
      console.log(item.id);
      await removeFromCart(item.id || 0);
    }

    cartItems.value = [];

    return { data: cartItems.value };
  };

  // Getters
  const cartItemsCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0);
  });

  const isCartEmpty = computed(() => cartItems.value.length === 0);

  return {
    // State
    cartItems: readonly(cartItems),
    loading: readonly(loading),
    error: readonly(error),
    justAdded: readonly(justAdded),

    // Actions
    addToCart,
    fetchCart,
    removeFromCart,
    updateCartItem,
    requestPasswordReset,
    clearCart,

    // Getters
    cartItemsCount,
    isCartEmpty
  };
});