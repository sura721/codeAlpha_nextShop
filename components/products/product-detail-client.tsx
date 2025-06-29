"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from "lucide-react"
import type { ProductWithDetails } from "@/lib/types"
import { useCart } from "@/contexts/cart-context"

export default function ProductDetailClient({ product }: { product: ProductWithDetails }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleAddToCart = () => {
    addItem(product.id, quantity)
  }

  const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0)
  const avgRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0
  const reviewCount = product.reviews.length

  const displayPrice = product.offerPrice ?? product.price
  const hasOffer = product.offerPrice && product.offerPrice < product.price
  const savePercentage = hasOffer ? Math.round(((product.price - product.offerPrice!) / product.price) * 100) : 0

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CHANGE 2: Increased the gap on large screens for better spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={product.images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.title}
                width={600}
                height={600}
                // CHANGE 3: Reduced image height on large screens (500px -> 450px)
                className="w-full h-96 lg:h-[450px] object-cover transition-all duration-300"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      selectedImageIndex === index ? "bg-indigo-600" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    selectedImageIndex === index ? "border-indigo-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-full">
                {product.category?.name || "Uncategorized"}
              </span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm text-gray-500 ml-2">({reviewCount} reviews)</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">${displayPrice.toFixed(2)}</span>
                {hasOffer && <span className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>}
                {hasOffer && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">Save {savePercentage}%</span>}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock > 10 ? "bg-green-500" : product.inStock > 0 ? "bg-yellow-500" : "bg-red-500"}`} />
              <span className="text-sm text-gray-600">
                {product.inStock > 10 ? "In Stock" : product.inStock > 0 ? "Low Stock" : "Out of Stock"} ({product.inStock} available)
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-indigo-600 transition-colors duration-300">-</button>
                <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:border-indigo-600 transition-colors duration-300">+</button>
              </div>
            </div>

            <div className="space-y-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} disabled={product.inStock === 0} className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Add to Wishlist</span>
              </motion.button>
            </div>

            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center space-x-3 text-gray-600"><Truck className="h-5 w-5" /><span>Free shipping on orders over $100</span></div>
              <div className="flex items-center space-x-3 text-gray-600"><Shield className="h-5 w-5" /><span>2-year warranty included</span></div>
              <div className="flex items-center space-x-3 text-gray-600"><RotateCcw className="h-5 w-5" /><span>30-day return policy</span></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}