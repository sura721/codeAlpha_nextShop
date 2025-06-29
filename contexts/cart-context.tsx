"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Cart, ShippingOption } from "@/types"

interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  addItem: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId:string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  setShipping: (shipping: ShippingOption) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/cart")
      if (!response.ok) {
        throw new Error("Failed to fetch cart data.")
      }
      const data: Cart = await response.json()
      setCart(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })
      if (!response.ok) throw new Error("Failed to add item.")
      const updatedCart: Cart = await response.json()
      setCart(updatedCart)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (productId: string) => {
    try {
        setIsLoading(true)
        const response = await fetch(`/api/cart?productId=${productId}`, {
            method: "DELETE"
        })
        if (!response.ok) throw new Error("Failed to remove item.")
        const updatedCart: Cart = await response.json()
        setCart(updatedCart)
    } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
        setIsLoading(false)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart?action=update_quantity`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })
      if (!response.ok) throw new Error("Failed to update quantity.")
      const updatedCart: Cart = await response.json()
      setCart(updatedCart)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }
  
  const setShipping = async (shipping: ShippingOption) => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/cart?action=set_shipping`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingMethod: shipping.name, shippingCost: shipping.price }),
      });
      if (!response.ok) throw new Error('Failed to set shipping option.');
      const updatedCart: Cart = await response.json();
      setCart(updatedCart);
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  const clearCart = async () => {
     try {
        setIsLoading(true)
        const response = await fetch("/api/cart", {
            method: "DELETE"
        })
        if (!response.ok) throw new Error("Failed to clear cart.")
        const updatedCart: Cart = await response.json()
        setCart(updatedCart)
    } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addItem,
        removeItem,
        updateQuantity,
        setShipping,
        clearCart
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