import { Category, Product, Review }  from '@/lib/generated/prisma'

export type ProductWithDetails = Product & {
  category: Category;
  reviews: Review[];
};