'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { CartWithDetails, cartWithDetailsValidator } from '../types';

/**
 * Adds a specific product variant to the logged-in user's shopping cart.
 * If the user has no cart, it creates one.
 * If the item is already in the cart, it increases the quantity.
 * @param productVariantId The ID of the product variant to add.
 * @param quantity The number of items to add.
 * @returns An object indicating success or failure.
 */
export async function addCartItem(productVariantId: string, quantity: number) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'You must be logged in to add items to your cart.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return { success: false, error: 'User account not found.' };
    }

    // Find the specific variant in the database. This is the critical step.
    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });

    if (!variant) {
      // This is the source of your "Product not found" error.
      return { success: false, error: 'The selected product option is no longer available.' };
    }

    if (variant.inStock < quantity) {
        return { success: false, error: `Sorry, only ${variant.inStock} items are available.` };
    }

    // Find the user's cart, or create one if it doesn't exist.
    const cart = await prisma.cart.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id },
    });

    // Check if the exact same variant is already in the cart.
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId: variant.id,
      },
    });

    if (existingCartItem) {
      // If it exists, update the quantity.
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // If it doesn't exist, create a new cart item.
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId: variant.id,
          quantity,
          price: variant.offerPrice ?? variant.price, // Store the price at the time of adding.
        },
      });
    }

    revalidatePath('/cart'); // Refresh cart page data for other parts of the app.
    return { success: true, message: 'Item added to cart!' };

  } catch (error) {
    console.error('Failed to add item to cart:', error);
    return { success: false, error: 'An unexpected server error occurred. Please try again.' };
  }
}


export async function getCart(): Promise<CartWithDetails | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return null;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    // Use the validator to ensure we fetch all the nested data
    ...cartWithDetailsValidator,
  });

  return cart;
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    // If quantity is 0 or less, remove the item
    return removeCartItem(itemId);
  }

  try {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update quantity." };
  }
}

export async function removeCartItem(itemId: string) {
  try {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to remove item." };
  }
}