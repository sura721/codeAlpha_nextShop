"use client"

import { useState, useTransition, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Star, CheckCircle, ChevronDown } from "lucide-react"
import { ProductWithDetails } from "@/lib/types"
import { useCart } from "@/contexts/cart-context"
import { clsx } from "clsx"

const getSwatchColor = (variantName: string): string => {
  const name = variantName.toLowerCase();
  if (name.includes("black")) return "bg-black";
  if (name.includes("white")) return "bg-white border-gray-300";
  if (name.includes("blue")) return "bg-blue-600";
  if (name.includes("red")) return "bg-red-600";
  if (name.includes("green")) return "bg-green-600";
  if (name.includes("purple")) return "bg-purple-600";
  if (name.includes("silver")) return "bg-gray-400";
  if (name.includes("graphite")) return "bg-gray-800";
  return "bg-gray-300";
};

const AccordionItem = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left">
        <span className="font-medium text-gray-800 dark:text-gray-200">{title}</span>
        <ChevronDown className={clsx("h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform", { "rotate-180": isOpen })} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pb-4 text-gray-600 dark:text-gray-300 prose prose-sm max-w-none dark:prose-invert"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


export default function ProductDetailClient({ product }: { product: ProductWithDetails }) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(
    Math.max(0, product.variants.findIndex(v => v.inStock > 0))
  );
  const [isPending, startTransition] = useTransition()
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    if (!isAdded) return;
    const timeout = setTimeout(() => setIsAdded(false), 2500);
    return () => clearTimeout(timeout);
  }, [isAdded]);

  if (!product?.variants || product.variants.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-500 dark:text-gray-400">Product not available.</p>
      </div>
    );
  }

  const selectedVariant = product.variants[selectedVariantIndex];

  const handleAddToCart = () => {
    startTransition(() => {
      addItem(selectedVariant.id, quantity);
      setIsAdded(true);
    });
  };

  const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
  const avgRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;
  const reviewCount = product.reviews.length;

  const displayPrice = selectedVariant.offerPrice ?? selectedVariant.price;
  const hasOffer = selectedVariant.offerPrice && selectedVariant.offerPrice < selectedVariant.price;

  return (
    <div className="bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">

          <div className="lg:sticky lg:top-24 self-start space-y-4">
            <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 aspect-square">
              <AnimatePresence>
                <motion.div
                  key={selectedVariant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={selectedVariant.image || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {product.variants.map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantIndex(index)}
                  className={clsx(
                    "relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ring-offset-2 ring-offset-white dark:ring-offset-gray-950",
                    {
                      "ring-2 ring-indigo-500": selectedVariantIndex === index,
                      "hover:opacity-80": selectedVariantIndex !== index,
                    }
                  )}
                >
                  <Image
                    src={variant.image || "/placeholder.svg"}
                    alt={variant.name}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 lg:mt-0 space-y-6">
            <div>
              <Link href={`/products?category=${product.category.slug}`} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">
                {product.category?.name || "Uncategorized"}
              </Link>
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-2">{product.title}</h1>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" />
                  ))}
                </div>
                <a href="#reviews" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">({reviewCount} customer reviews)</a>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">${displayPrice.toFixed(2)}</span>
              {hasOffer && <span className="text-xl text-gray-400 dark:text-gray-500 line-through">${selectedVariant.price.toFixed(2)}</span>}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Color: <span className="font-normal text-gray-600 dark:text-gray-300">{selectedVariant.name}</span></h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantIndex(index)}
                    disabled={variant.inStock === 0}
                    className={clsx(
                      "relative w-8 h-8 rounded-full transition-all duration-200 flex items-center justify-center ring-offset-2 ring-offset-white dark:ring-offset-gray-950",
                      {
                        "ring-2 ring-indigo-500": selectedVariantIndex === index,
                        "hover:ring-2 hover:ring-gray-400 dark:hover:ring-gray-500": variant.inStock > 0,
                        "cursor-not-allowed": variant.inStock === 0,
                      }
                    )}
                    aria-label={`Select ${variant.name}`}
                  >
                    <span className={clsx("w-full h-full rounded-full", getSwatchColor(variant.name))} />
                    {variant.inStock === 0 && <span className="absolute w-full h-0.5 bg-red-600 transform rotate-45" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg transition">-</button>
                    <span className="w-10 text-center font-medium text-gray-900 dark:text-white">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(selectedVariant.inStock, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg transition">+</button>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isPending || selectedVariant.inStock === 0}
                  className={clsx(
                    "w-full text-white py-2.5 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2",
                    { "bg-indigo-600 hover:bg-indigo-700": !isAdded },
                    { "bg-green-600": isAdded },
                    { "bg-gray-400 cursor-not-allowed": selectedVariant.inStock === 0 }
                  )}
                >
                  {isAdded ? (
                    <> <CheckCircle className="h-5 w-5" /> <span>Added to Cart!</span> </>
                  ) : (
                    <> <ShoppingCart className="h-5 w-5" /> <span>{isPending ? "Adding..." : "Add to Cart"}</span> </>
                  )}
                </motion.button>
              </div>
              <div className="text-center text-sm">
                {selectedVariant.inStock > 0 ? (
                  <p className="text-green-700 font-medium">In Stock{selectedVariant.inStock <= 10 && `, only ${selectedVariant.inStock} left!`}</p>
                ) : (
                  <p className="text-red-600 font-medium">Out of Stock</p>
                )}
              </div>
            </div>

            <div className="pt-6">
              <AccordionItem title="Description">
                <p>{product.description}</p>
              </AccordionItem>
              <AccordionItem title="Shipping & Returns">
                <p>Enjoy free shipping on orders over $100. We offer a 30-day return policy for unused items in their original packaging. Please see our full policy for more details.</p>
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}