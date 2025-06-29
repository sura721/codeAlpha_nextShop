import HeroSection from "@/components/hero-section"
import ProductCard from "@/components/products/product-card"
import { getProducts } from "@/lib/actions/product.actions"
import { Suspense } from "react"
import LoadingSkeleton from "@/components/loading-skeleton"
import { Product } from "@/lib/generated/prisma"

// async function FeaturedProducts() {
//   // Simulate API call with delay
//   const products = await getProducts()
//   const featuredProducts = products.filter((product:Product[]) => product.featured)

//   return (
//     <section className="py-16 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Discover our handpicked selection of premium products that define luxury and excellence.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//           {featuredProducts.map((product, index) => (
//             <ProductCard key={product.id} product={product} index={index} />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

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
        {/* <FeaturedProducts /> */}
      </Suspense>
    </div>
  )
}