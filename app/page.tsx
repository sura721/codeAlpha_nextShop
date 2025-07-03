import HeroSection from "@/components/hero-section"
import ProductCard from "@/components/products/product-card"
import { getProducts } from "@/lib/actions/product.actions"
import { Suspense } from "react"
import LoadingSkeleton from "@/components/loading-skeleton"
import { Product } from "@/lib/generated/prisma"

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <Suspense
        fallback={
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="bg-gray-200 rounded h-8 w-64 mx-auto mb-4" />
                <div className="bg-gray-200 rounded h-6 w-96 mx-auto" />
              </div>
              <LoadingSkeleton count={3} />
            </div>
          </section>
        }
      >
      </Suspense>
    </div>
  )
}