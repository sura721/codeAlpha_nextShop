// contexts/cart-context.tsx
"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { getCart, addItemToCart, removeItemFromCart, updateItemQuantityInCart } from "@/lib/actions/cart.actions"
import toast from "react-hot-toast"
import type { Cart as PrismaCart, CartItem, Product } from "@/lib/generated/prisma"

type CartItemWithProduct = CartItem & { product: Product };
type FullCart = PrismaCart & { items: CartItemWithProduct[] };

interface CartContextType {
  cart: FullCart | null
  cartItemCount: number
  isCartLoading: boolean
  addItem: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<FullCart | null>(null)
  const [isCartLoading, setIsCartLoading] = useState(true)

  const loadCart = useCallback(async () => {
    setIsCartLoading(true);
    try {
      const currentCart = await getCart()
      setCart(currentCart)
    } catch (error) {
      toast.error("Could not fetch cart.")
    } finally {
      setIsCartLoading(false);
    }
  }, [])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addItem = async (productId: string, quantity: number) => {
    const result = await addItemToCart(productId, quantity);
    if (result.success) {
      toast.success(result.message);
      loadCart();
    } else {
      toast.error(result.message);
    }
  }

  const removeItem = async (productId: string) => {
    const previousCart = cart;
    const optimisticCart = cart ? { ...cart, items: cart.items.filter(item => item.productId !== productId) } : null;
    setCart(optimisticCart);
    const result = await removeItemFromCart(productId);
    if (!result.success) {
      setCart(previousCart);
      toast.error(result.message);
    } else {
      toast.success(result.message)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!cart) return;
    const previousCart = cart;
    const optimisticCart = {
      ...cart,
      items: cart.items.map(item => item.productId === productId ? { ...item, quantity } : item)
    };
    setCart(optimisticCart);
    const result = await updateItemQuantityInCart(productId, quantity);
    if (!result.success) {
      setCart(previousCart);
      toast.error(result.message);
    }
  }
  
  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItemCount,
        isCartLoading,
        addItem,
        removeItem,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}