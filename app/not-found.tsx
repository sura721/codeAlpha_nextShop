// app/not-found.tsx

import Link from 'next/link';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="space-y-4">
        <Frown className="mx-auto h-16 w-16 text-gray-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 tracking-tight">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go back Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Shop Products
          </Link>
        </div>
      </div>
    </main>
  );
}