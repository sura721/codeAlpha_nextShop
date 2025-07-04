 'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { Prisma } from '@/lib/generated/prisma';
import { z } from 'zod';
import { slugify } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';

async function isAdmin() {
  const { userId } = await auth();
  if (!userId) return false;
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  return user?.admin === true;
}

async function createUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

const variantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  price: z.number().min(0, 'Price must be positive'),
  inStock: z.number().int().min(0, 'Stock must be a positive integer'),
  image: z.string().url('A valid image URL is required'),
  offerPrice: z.number().min(0).optional().nullable(),
});

const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  variants: z.array(variantSchema).min(1, 'At least one product variant is required'),
});

export async function createProductWithVariants(data: unknown) {
  if (!(await isAdmin())) {
    return { success: false, error: { form: 'Unauthorized: You are not an admin.' } };
  }

  const result = productSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error.flatten().fieldErrors };
  }

  const { title, description, categoryId, variants } = result.data;

  try {
    const slug = await createUniqueSlug(title);

    await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          title,
          description,
          categoryId,
          slug,
        },
      });

      await tx.productVariant.createMany({
        data: variants.map((variant) => ({
          name: variant.name,
          price: variant.price,
          inStock: variant.inStock,
          image: variant.image,
          offerPrice: variant.offerPrice,
          productId: newProduct.id,
          sku: `${slug}-${slugify(variant.name)}`,
        })),
      });
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true };
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
        return { success: false, error: { form: 'A product or variant with this name/SKU already exists.' } };
    }
    return { success: false, error: { form: 'An unexpected database error occurred.' } };
  }
}

export async function deleteProduct(productId: string) {
  if (!(await isAdmin())) {
    return { success: false, message: 'Unauthorized.' };
  }
  if (!productId) {
    throw new Error('Product ID is required.');
  }

  try {
    
    const existingOrderCount = await prisma.orderItem.count({
      where: {
        productVariant: {
          productId: productId,
        },
        order: {
          
          id: { not: undefined } 
        }
      },
    });

    if (existingOrderCount > 0) {
      return { 
        success: false, 
        message: 'Cannot delete product. It is part of one or more past orders. Consider deactivating it instead.' 
      };
    }
    
     await prisma.$transaction(async (tx) => {
       await tx.cartItem.deleteMany({
        where: {
          productVariant: {
            productId: productId,
          },
        },
      });
 
      await tx.productVariant.deleteMany({ where: { productId: productId } });

       await tx.review.deleteMany({ where: { productId: productId } });

       await tx.product.delete({ where: { id: productId } });
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/cart'); 
    return { success: true, message: 'Product and its associations deleted successfully.' };

  } catch (error) {
     return { success: false, message: 'Failed to delete product.' };
  }
}
export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: slug },
      include: {
        category: true,
        reviews: { include: { user: true } },
        variants: true,
      },
    });
    return product;
  } catch (error) {
    throw new Error('Failed to fetch product.');
  }
}

interface GetProductsParams {
  query?: string;
  category?: string;
}

interface GetProductsParams {
  query?: string;
  category?: string;
  priceLessThan?: number;
  priceGreaterThan?: number;
}

export async function getProducts({ query, category, priceLessThan, priceGreaterThan }: GetProductsParams) {
  const andConditions: Prisma.ProductWhereInput[] = [{ isActive: true }];

  if (category && category !== 'all') {
    andConditions.push({
      category: {
        slug: category,
      },
    });
  }

  if (query) {
    andConditions.push({
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { variants: { some: { name: { contains: query, mode: 'insensitive' } } } },
      ],
    });
  }
  
  // Add price filtering directly to the database query
  if (priceLessThan !== undefined) {
    andConditions.push({ variants: { some: { price: { lt: priceLessThan } } } });
  }

  if (priceGreaterThan !== undefined) {
    andConditions.push({ variants: { some: { price: { gt: priceGreaterThan } } } });
  }

  try {
    const products = await prisma.product.findMany({
      where: { AND: andConditions },
      include: {
        category: true,
        reviews: true,
        variants: { orderBy: { price: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return products;
  } catch (error) {
     return [];
  }
}








export async function deactivateProduct(productId: string) {
  if (!(await isAdmin())) {
    return { success: false, message: 'Unauthorized.' };
  }
  if (!productId) {
    throw new Error('Product ID is required.');
  }

  try {
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true, message: 'Product deactivated successfully.' };
  } catch (error) {
     return { success: false, message: 'Failed to deactivate product.' };
  }
}


export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}




export async function getAllProductsForSitemap() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      }
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
    return [];
  }
}

export async function getAllCategoriesForSitemap() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      }
    });
    return categories;
  } catch (error) {
    console.error("Failed to fetch categories for sitemap:", error);
    return [];
  }
}
