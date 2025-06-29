'use client';

import { useState, useEffect, use } from 'react'; // 1. Import 'use' from React
import ProductForm from '@/components/admin/ProductForm';
import { Loader2 } from 'lucide-react';

// 2. Update the type of the params prop to be a Promise
export default function EditProductPage({ params: paramsPromise }: { params: Promise<{ productId: string }> }) {
  // 3. Unwrap the promise using the use() hook
  const params = use(paramsPromise);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.productId}`);
        if (!res.ok) {
          throw new Error('Product not found');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.productId]); // This dependency array is now correct

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 border-b pb-4">Edit Product</h1>
      {product && <ProductForm product={product} />}
    </main>
  );
}