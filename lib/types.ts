import { Category, Product, Review }  from '@/lib/generated/prisma'

export type ProductWithDetails = Product & {
  category: Category;
  reviews: Review[];
};

export type CartItemType = {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  inStock: number;
  image: string;
};
