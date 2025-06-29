'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/product.actions'; // Adjust path if needed

type ProductActionsProps = {
  productId: string;
};

export default function ProductActions({ productId }: ProductActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      startTransition(() => {
        deleteProduct(productId);
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/products/edit/${productId}`} className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
        <Edit className="h-4 w-4" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="p-2 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  );
}