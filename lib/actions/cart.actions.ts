// lib/actions/cart.actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';
import { CartWithDetails, cartWithDetailsValidator } from '../types';
import prisma from '../prisma';

// THIS IS THE CRITICAL TYPE DEFINITION THAT MUST BE AT THE TOP OF THE FILE
type CartActionResult = 
  | { success: true; message?: string; cart: CartWithDetails | null }
  | { success: false; error: string };


async function findUserAndCart() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return { user: null, cart: null };

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: {
      cart: {
        ...cartWithDetailsValidator,
      },
    },
  });

  return { user, cart: user?.cart ?? null };
}

export async function addCartItem(productVariantId: string, quantity: number): Promise<CartActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'You must be logged in to add items to your cart.' };
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return { success: false, error: 'User account not found.' };
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });

    if (!variant) {
      return { success: false, error: 'The selected product option is no longer available.' };
    }

    if (variant.inStock < quantity) {
      return { success: false, error: `Sorry, only ${variant.inStock} items are available.` };
    }

    const cart = await prisma.cart.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productVariantId: variant.id,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productVariantId: variant.id,
          quantity,
          price: variant.offerPrice ?? variant.price,
        },
      });
    }

    revalidatePath('/cart');
    const updatedCart = await getCart();
    return { success: true, message: 'Item added to cart!', cart: updatedCart };

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
    ...cartWithDetailsValidator,
  });

  return cart;
}

export async function updateCartItemQuantity(itemId: string, quantity: number): Promise<CartActionResult> {
  if (quantity <= 0) {
    return removeCartItem(itemId);
  }

  try {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
    revalidatePath('/cart');
    const updatedCart = await getCart();
    return { success: true, cart: updatedCart };
  } catch (error) {
    return { success: false, error: "Failed to update quantity." };
  }
}

export async function removeCartItem(itemId: string): Promise<CartActionResult> {
  try {
    await prisma.cartItem.delete({
      where: { id: itemId },
    });
    revalidatePath('/cart');
    const updatedCart = await getCart();
    return { success: true, cart: updatedCart };
  } catch (error) {
    return { success: false, error: "Failed to remove item." };
  }
}

export async function clearCart(): Promise<CartActionResult> {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: 'User not found.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });
    
    if (!user) {
      return { success: false, error: 'User account not found.' };
    }

    const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        select: { id: true }
    });

    if (cart) {
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
    }
    
    revalidatePath('/cart');
    const updatedCart = await getCart();
    return { success: true, message: 'Cart has been emptied!', cart: updatedCart };

  } catch (error) {
    console.error('Failed to clear cart:', error);
    return { success: false, error: 'An unexpected server error occurred.' };
  }
}