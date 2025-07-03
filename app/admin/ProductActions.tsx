'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/product.actions';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type ProductActionsProps = {
  productId: string;
};

export default function ProductActions({ productId }: ProductActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    startTransition(() => {
      deleteProduct(productId);
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/products/edit/${productId}`}
          className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
        >
          <Edit className="h-4 w-4" />
        </Link>

        <DialogTrigger asChild>
          <button
            disabled={isPending}
            className="p-2 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </DialogTrigger>
      </div>

      <DialogContent className="bg-white rounded-lg p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
           permanently delete?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
