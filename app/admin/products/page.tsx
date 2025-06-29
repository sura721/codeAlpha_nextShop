import Link from 'next/link';
import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import prisma from '@/lib/prisma'; // Adjust path if needed
import ProductActions from '../ProductActions';

async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
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
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-purple-700 transition-colors">
            <PlusCircle className="h-5 w-5" />
            Add New Product
          </button>
        </Link>
      </div>

      {/* --- Desktop Table View --- */}
      {/* This entire div is hidden on small screens and becomes a block element on medium screens and up */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600">Image</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Title</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Category</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Price</th>
                <th className="p-4 text-sm font-semibold text-slate-600">In Stock</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4"><div className="h-16 w-16 flex-shrink-0">{product.images.length > 0 ? (<Image src={product.images[0]} alt={product.title} width={64} height={64} className="h-full w-full object-cover rounded-md" />) : (<div className="h-16 w-16 bg-slate-200 rounded-md flex items-center justify-center text-xs text-slate-500">No Image</div>)}</div></td>
                  <td className="p-4 text-sm font-medium text-slate-800">{product.title}</td>
                  <td className="p-4 text-sm text-slate-600">{product.category.name}</td>
                  <td className="p-4 text-sm text-slate-600">${product.price.toFixed(2)}</td>
                  <td className="p-4 text-sm text-slate-600">{product.inStock}</td>
                  <td className="p-4"><ProductActions productId={product.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Mobile Card View --- */}
      {/* This div is visible by default and hidden on medium screens and up */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex gap-4">
              <div className="h-24 w-24 flex-shrink-0">
                {product.images.length > 0 ? (
                  <Image src={product.images[0]} alt={product.title} width={96} height={96} className="h-full w-full object-cover rounded-md" />
                ) : (
                  <div className="h-24 w-24 bg-slate-200 rounded-md flex items-center justify-center text-xs text-slate-500">No Image</div>
                )}
              </div>
              <div className="flex-grow space-y-1">
                <h3 className="text-base font-bold text-slate-800">{product.title}</h3>
                <p className="text-sm text-slate-500">{product.category.name}</p>
                <p className="text-sm font-semibold text-purple-600">${product.price.toFixed(2)}</p>
                <p className="text-xs text-slate-500">Stock: {product.inStock}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex justify-end">
              <ProductActions productId={product.id} />
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-500">No products found. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}