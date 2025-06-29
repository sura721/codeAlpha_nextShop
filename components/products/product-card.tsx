"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import type { Product } from "@/types"
import { useCart } from "@/contexts/cart-context"
import ToastNotification from "../toast-notification"
interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, isLoading } = useCart()
  const [showToast, setShowToast] = useState(false)
  const router = useRouter()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLoading) return
    
    await addItem(product.id, 1)
    setShowToast(true)

    setTimeout(() => {
      router.push("/cart")
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative overflow-hidden">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.title}
            width={400}
            height={300}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/20 flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              <ShoppingCart className="h-5 w-5" />
            </motion.button>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300"
          >
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
          </motion.button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
              {product.title}
            </h3>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{product.category.name}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">${(product.offerPrice || product.price).toFixed(2)}</span>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{product.inStock} in stock</span>
              <div
                className={`w-2 h-2 rounded-full ${product.inStock > 10 ? "bg-green-500" : product.inStock > 0 ? "bg-yellow-500" : "bg-red-500"}`}
              />
            </div>
          </div>
        </div>
        <ToastNotification
          show={showToast}
          message={`${product.title} added to cart!`}
          onClose={() => setShowToast(false)}
          type="success"
        />
      </Link>
    </motion.div>
  )
}