// /app/admin/products/page.tsx (or wherever this file is located)
import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import prisma from '@/lib/prisma';
import productActions
// --- FIX 1: Update the data fetching function ---
// We now include the variants, but only take the first one (ordered by price)
// for efficiency on the list page.
async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: {
        orderBy: {
          price: 'asc',
        },
        take: 1, // Only fetch the primary variant for the list view
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return products;
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Products</h1>
        <Link href="/admin/add/product" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 transition-colors">
            <PlusCircle className="h-5 w-5" />
            Add New Product
          </button>
        </Link>
      </div>

      {/* --- Desktop Table View --- */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600">Image</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Title</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Category</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Price (from)</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Stock</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                // --- FIX 2: Get the primary variant from the product's variants array ---
                const primaryVariant = product.variants[0];
                return (
                  <tr key={product.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-4">
                      <div className="h-16 w-16 flex-shrink-0">
                        {/* --- FIX 3: Use the image from the primary variant --- */}
                        {primaryVariant?.image ? (
                          <Image src={primaryVariant.image} alt={product.title} width={64} height={64} className="h-full w-full object-cover rounded-md" />
                        ) : (
                          <div className="h-16 w-16 bg-slate-200 rounded-md flex items-center justify-center text-xs text-slate-500">No Image</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-800">{product.title}</td>
                    <td className="p-4 text-sm text-slate-600">{product.category.name}</td>
                    {/* --- FIX 4: Use the price from the primary variant. Handle cases where there are no variants. --- */}
                    <td className="p-4 text-sm text-slate-600">{primaryVariant ? `$${primaryVariant.price.toFixed(2)}` : 'N/A'}</td>
                    {/* --- FIX 5: Use the stock from the primary variant. --- */}
                    <td className="p-4 text-sm text-slate-600">{primaryVariant ? primaryVariant.inStock : 'N/A'}</td>
                    <td className="p-4"><ProductActions productId={product.id} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Mobile Card View (with the same fixes) --- */}
      <div className="md:hidden space-y-4">
        {products.map((product) => {
          const primaryVariant = product.variants[0];
          return (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <div className="flex gap-4">
                <div className="h-24 w-24 flex-shrink-0">
                  {primaryVariant?.image ? (
                    <Image src={primaryVariant.image} alt={product.title} width={96} height={96} className="h-full w-full object-cover rounded-md" />
                  ) : (
                    <div className="h-24 w-24 bg-slate-200 rounded-md flex items-center justify-center text-xs text-slate-500">No Image</div>
                  )}
                </div>
                <div className="flex-grow space-y-1">
                  <h3 className="text-base font-bold text-slate-800">{product.title}</h3>
                  <p className="text-sm text-slate-500">{product.category.name}</p>
                  <p className="text-sm font-semibold text-indigo-600">{primaryVariant ? `From $${primaryVariant.price.toFixed(2)}` : 'N/A'}</p>
                  <p className="text-xs text-slate-500">{primaryVariant ? `Stock: ${primaryVariant.inStock}` : 'No stock info'}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
                <ProductActions productId={product.id} />
              </div>
            </div>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-500">No products found. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}