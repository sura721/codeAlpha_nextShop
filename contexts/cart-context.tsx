// context/CartContext.tsx

'use client';

import { createContext, useContext, useState, useTransition, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { addCartItem, getCart, removeCartItem, updateCartItemQuantity, clearCart } from '@/lib/actions/cart.actions';
import { CartWithDetails } from '@/lib/types';

interface CartContextType {
  cart: CartWithDetails | null;
  cartCount: number;
  addItem: (productVariantId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearTheCart: () => Promise<void>; // THIS LINE IS THE FIX
  isCartLoading: boolean;
  isInitializing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartWithDetails | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isCartLoading, startTransition] = useTransition();
  const [isInitializing, setIsInitializing] = useState(true);

  const updateCartState = useCallback((newCart: CartWithDetails | null) => {
    setCart(newCart);
    const count = newCart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    setCartCount(count);
  }, []);

  useEffect(() => {
    const loadInitialCart = async () => {
      try {
        const initialCart = await getCart();
        updateCartState(initialCart);
      } catch (error) {
        console.error("Failed to load initial cart", error);
        toast.error("Could not load your cart.");
      } finally {
        setIsInitializing(false);
      }
    };
    loadInitialCart();
  }, [updateCartState]);

  const addItem = async (productVariantId: string, quantity: number) => {
    startTransition(async () => {
      const result = await addCartItem(productVariantId, quantity);
      if (result.success && result.cart) {
        toast.success(result.message || 'Item added!');
        updateCartState(result.cart);
      } else {
        toast.error('Failed to add item.');
      }
    });
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    startTransition(async () => {
      const result = await updateCartItemQuantity(itemId, quantity);
      if (result.success && result.cart) {
        updateCartState(result.cart);
      } else {
        toast.error('Failed to update quantity.');
      }
    });
  };

  const removeItem = async (itemId: string) => {
    startTransition(async () => {
      const result = await removeCartItem(itemId);
      if (result.success && result.cart) {
        toast.success('Item removed.');
        updateCartState(result.cart);
      } else {
        toast.error('Failed to remove item.');
      }
    });
  };


  const clearTheCart = async () => {
    startTransition(async () => {
      const result = await clearCart();
      // THIS IS THE FIX
      // By checking `result.success`, TypeScript knows `result` is the success
      // object, which guarantees `result.cart` exists and is of type `CartWithDetails | null`.
      if (result.success) {
        toast.success(result.message || 'Cart cleared!');
        updateCartState(result.cart);
      } else {
        toast.error(result.error || 'Failed to clear cart.');
      }
    });
  };

  const value = {
    cart,
    cartCount,
    addItem,
    updateItemQuantity,
    removeItem,
    clearTheCart, // THIS LINE IS ALSO PART OF THE FIX
    isCartLoading,
    isInitializing,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};