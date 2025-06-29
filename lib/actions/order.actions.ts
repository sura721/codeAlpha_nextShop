'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { OrderStatus } from '../generated/prisma';

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  if (!orderId || !newStatus) {
    throw new Error('Order ID and new status are required.');
  }

  try {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: newStatus,
      },
    });

    // Revalidate the orders page to show the updated status immediately
    revalidatePath('/admin/orders');

    return { success: true, message: 'Order status updated.' };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return { success: false, message: 'Failed to update order status.' };
  }
}