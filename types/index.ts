import type { Prisma } from "@/lib/generated/prisma";

export type Product = Prisma.ProductGetPayload<{
  include: {
    category: true
  }
}>

export type CartItem = {
  id: string
  product: Product
  quantity: number
  price: number
}

export type Cart = {
  id: string
  items: CartItem[]
  total: number
  itemCount: number
  shippingMethod: string | null
  shippingCost: number | null
  grandTotal: number
}

export type ShippingOption = {
  name: string
  price: number
  delivery: string
}