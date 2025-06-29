"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import type { Category } from "@/lib/generated/prisma";
import { useState, useEffect } from 'react';

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State to manage the input value for debouncing
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  // BONUS: Debounce the search input to improve performance
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set('q', searchTerm);
      } else {
        params.delete('q');
      }
      // THE FIX: Add { scroll: false } to prevent jumping to the top
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300); // Wait for 300ms after user stops typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);


  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    const category = e.target.value;
    
    if (category === "All") {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    // THE FIX: Add { scroll: false } here as well
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            // Use the debounced state
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            // Read value directly from searchParams for consistency
            value={searchParams.get('category') || 'All'}
            onChange={handleCategoryChange}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}