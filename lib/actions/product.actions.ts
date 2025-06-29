'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ProductWithDetails } from '@/lib/types';
import { Category, Prisma } from '../generated/prisma';

export async function deleteProduct(productId: string) {
  if (!productId) {
    throw new Error('Product ID is required.');
  }

  try {
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    revalidatePath('/admin/products');

    return { success: true, message: 'Product deleted successfully.' };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, message: 'Failed to delete product.' };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  if (!productId) {
    return { success: false, message: 'Product ID is missing.' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const inStock = parseInt(formData.get('inStock') as string);
  const categoryId = formData.get('categoryId') as string;
  const images = (formData.get('images') as string).split(',').map(img => img.trim()).filter(img => img.length > 0);

  if (!title || !description || !price || !inStock || !categoryId) {
    return { success: false, message: 'All fields are required.' };
  }

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        description,
        price,
        inStock,
        categoryId,
        images,
      },
    });
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, message: 'Database error: Failed to update product.' };
  }

  revalidatePath('/admin/products');
  revalidatePath(`/products/${productId}`); 
  redirect('/admin/products');
}

// export async function getProducts(): Promise<ProductWithDetails[]> {
//   const products = await prisma.product.findMany({
//     where: {
//       NOT: {
//         images: {
//           equals: []
//         }
//       }
//     },
//     include: {
//       category: true,
//       reviews: true
//     }
//   });

//   return products;
// }

// --- NEW FUNCTION ADDED HERE ---
export async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        category: true, // Include category data for the detail page
        reviews: true,  // Include reviews to calculate ratings
      },
    });
    return product;
  } catch (error) {
    console.error('Failed to get product by slug:', error);
    throw new Error('Failed to fetch product.');
  }
}





// --- REPLACE your old getProducts with this new one ---
interface GetProductsParams {
  query?: string;
  category?: string;
}

export async function getProducts({ query, category }: GetProductsParams): Promise<ProductWithDetails[]> {
  const where: Prisma.ProductWhereInput = {
    NOT: {
      images: {
        equals: []
      }
    }
  };

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } }
    ];
  }

  if (category && category !== 'All') {
    // Assuming you want to filter by category name. If you use slugs, change to `slug: category`
    where.category = {
      name: category
    };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      reviews: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return products;
}


export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}