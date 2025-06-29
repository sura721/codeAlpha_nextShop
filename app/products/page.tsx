import { Suspense } from 'react';
import LoadingSkeleton from "@/components/loading-skeleton";
import { getProducts, getCategories } from "@/lib/actions/product.actions";
import ProductsIntroSection from "@/components/products-intro-section";
import ProductFilters from '@/components/products/product-filters';
import ProductGrid from '@/components/products/product-grid'; // Import the new client component

// The page is an async Server Component
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductsIntroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductFilters categories={categories} />

        <Suspense fallback={<LoadingSkeleton count={8} />}>
          {/* This new component fetches data and passes it to the client grid */}
          <ProductList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

// This remains a Server Component responsible for data fetching
async function ProductList({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  // Fetch the products based on the search params
  const filteredProducts = await getProducts({
    query: searchParams.q,
    category: searchParams.category,
  });

  // Render the CLIENT component and pass the fetched data as a prop
  return <ProductGrid products={filteredProducts} />;
}