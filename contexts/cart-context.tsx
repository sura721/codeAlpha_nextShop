// contexts/cart-context.tsx
"use client";

import { createContext, useContext, useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';
// Import the corrected server action
import { addCartItem } from '@/lib/actions/cart.actions';

interface CartContextType {
  // ... other properties like cartItems, total, etc.
  addItem: (productVariantId: string, quantity: number) => Promise<void>;
  isCartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isCartLoading, startTransition] = useTransition();
  // ... other state for cart items

  const addItem = async (productVariantId: string, quantity: number) => {
    startTransition(async () => {
      // --- THIS IS THE FIX ---
      // Call the corrected server action that works with variant IDs
      const result = await addCartItem(productVariantId, quantity);

      if (result.success) {
        toast.success(result.message || 'Item added!');
        // You would also refetch your cart data here
      } else {
        // This is where the toast error is generated
        toast.error(result.error || 'Failed to add item.');
      }
    });
  };

  const value = {
    // ... other values
    addItem,
    isCartLoading,
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