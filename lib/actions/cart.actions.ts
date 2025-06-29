// lib/actions/cart.actions.ts
'use server';

import prisma from '../prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@clerk/nextjs/server';

async function getInternalUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error('User not authenticated.');
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error('User not found in database.');
  return user;
}

async function findOrCreateCart(userId: string) {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) return cart;
  return await prisma.cart.create({ data: { userId } });
}

export async function getCart() {
  try {
    const { userId } = await auth();
    if (!userId) return null;
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return null;
    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: true },
          orderBy: { product: { title: 'asc' } },
        },
      },
    });
    return cart;
  } catch (error) {
    console.error('Failed to get cart:', error);
    return null;
  }
}

export async function updateItemQuantityInCart(productId: string, quantity: number) {
  try {
    const user = await getInternalUser();
    const cart = await findOrCreateCart(user.id);
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      return { success: false, message: 'Product not found.' };
    }
    if (product.inStock < quantity) {
      return { success: false, message: `Only ${product.inStock} items in stock.` };
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });
    } else {
      await prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity },
      });
    }

    revalidatePath('/cart');
    return { success: true, message: 'Cart updated.' };
  } catch (error) {
    return { success: false, message: 'Failed to update cart.' };
  }
}

// Other actions (addItem, removeItem) from the previous answer are fine
export async function addItemToCart(productId: string, quantity: number) {
  try {
    const user = await getInternalUser();
    const cart = await findOrCreateCart(user.id);
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return { success: false, message: 'Product not found.' };
    if (product.inStock < quantity) return { success: false, message: 'Not enough stock available.' };
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: { increment: quantity } },
      create: {
        cartId: cart.id,
        productId,
        quantity,
        price: product.offerPrice ?? product.price,
      },
    });
    revalidatePath('/cart');
    return { success: true, message: 'Item added to cart!' };
  } catch (error) {
    return { success: false, message: 'Failed to add item.' };
  }
}

export async function removeItemFromCart(productId: string) {
  try {
    const user = await getInternalUser();
    const cart = await findOrCreateCart(user.id);
    await prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
    revalidatePath('/cart');
    return { success: true, message: 'Item removed.' };
  } catch (error) {
    return { success: false, message: 'Failed to remove item.' };
  }
}