import { Category, Prisma, Product, Review }  from '@/lib/generated/prisma'
const productWithDetails = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    category: true,
    reviews: true,
    variants: {
      orderBy: {
        price: 'asc'
      }
    },
  },
});

export type CartItemType = {
  id: string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  inStock: number;
  image: string;
};

export type ProductWithDetails = Prisma.ProductGetPayload<typeof productWithDetails>;

export const cartWithDetailsValidator = Prisma.validator<Prisma.CartDefaultArgs>()({
  include: {
    items: {
      // orderBy: { createdAt: 'asc' }, // REMOVE THIS LINE
      include: {
        productVariant: {
          include: {
            product: true,
          },
        },
      },
    },
  },
});

export type CartWithDetails = Prisma.CartGetPayload<typeof cartWithDetailsValidator>;