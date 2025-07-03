"use server";
 import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from 'next/cache';
import prisma from "@/lib/prisma";
import type { CartWithDetails } from "../types";

import { Order, OrderItem, Product, ProductVariant, OrderStatus } from '@/lib/generated/prisma'; 

type ShippingData = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
};

type ShippingMethod = {
  id: string;
  name:string;
  price: number;
  delivery: string;
};

type OrderItemWithDetails = OrderItem & {
  productVariant: ProductVariant & {
    product: Product;
  };
};

export type OrderWithDetails = Order & {
  items: OrderItemWithDetails[];
};

export async function createOrder(
  cart: CartWithDetails,
  shippingData: ShippingData,
  shippingMethod: ShippingMethod
) {
  const { userId: clerkId } =await  auth()

  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.productVariant.price * item.quantity,
    0
  );
  const taxes = subtotal * 0.05;
  const grandTotal = subtotal + taxes + shippingMethod.price;

  try {
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId: user.id,
          total: subtotal + taxes,
          grandTotal,
          shippingCost: shippingMethod.price,
          shippingMethod: shippingMethod.name,
          shippingAddress: shippingData, 
          status: "PENDING",
        },
      });

      const orderItems = cart.items.map((item) => ({
        orderId: order.id,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        price: item.productVariant.price,
      }));

      await tx.orderItem.createMany({
        data: orderItems,
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: {
            deleteMany: {},
          },
        },
      });

      return order;
    });

    return { success: true, orderId: newOrder.id };
  } catch (error) {
     return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function getOrderDetails(orderId: string): Promise<OrderWithDetails | null> {
  const { userId: clerkId } =await auth(); 

  if (!clerkId) {
    redirect("/sign-in");
  }
  
  const user = await prisma.user.findUnique({ where: { clerkId }});
  if (!user) return null;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      userId: user.id,
    },
     include: {
      items: {
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

   return order as OrderWithDetails | null;
}

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  if (!orderId || !newStatus) {
    return { success: false, message: 'Order ID and new status are required.' };
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

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath(`/account/orders`);

    return { success: true, message: 'Order status updated successfully.' };
  } catch (error) {
     return { success: false, message: 'Failed to update order status.' };
  }
}


export async function getOrdersForUser() {
  const { userId: clerkId } =await auth();
  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
     return []; 
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
     include: {
      _count: {
        select: { items: true },
      },
    },
     orderBy: {
      createdAt: 'desc',
    },
  });

  return orders;
}

