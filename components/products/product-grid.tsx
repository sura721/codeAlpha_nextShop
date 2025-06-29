"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/products/product-card";
import { ProductWithDetails } from "@/lib/types";

export default function ProductGrid({ products }: { products: ProductWithDetails[] }) {
  return (
    <>
      {products.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </motion.div>
      )}
    </>
  );
}