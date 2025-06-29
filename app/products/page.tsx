import { Suspense } from 'react';
import LoadingSkeleton from "@/components/loading-skeleton";
import { getProducts, getCategories } from "@/lib/actions/product.actions";
import ProductsIntroSection from "@/components/products-intro-section";
import ProductFilters from '@/components/products/product-filters';
import ProductGrid from '@/components/products/product-grid';

// 1️⃣ Update type to Promise pattern
type ProductsPageProps = {
  searchParams: Promise<{ q?: string; category?: string }>;
};

// 2️⃣ Use destructuring with `await` to unwrap promise
export default async function ProductsPage({ searchParams: searchParamsPromise }: ProductsPageProps) {
  const searchParams = await searchParamsPromise;
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductsIntroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductFilters categories={categories} />

        <Suspense fallback={<LoadingSkeleton count={8} />}>
          <ProductList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductList({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const filteredProducts = await getProducts({
    query: searchParams.q,
    category: searchParams.category,
  });

  return <ProductGrid products={filteredProducts} />;
}
