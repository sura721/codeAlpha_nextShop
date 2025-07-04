"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import type { OrderWithDetails } from "@/lib/actions/order.actions";
import DeliveryProgress from "./DeliveryProgress";

function isShippingAddress(obj: unknown): obj is { firstName: string; lastName: string; address: string; city: string; postalCode: string; email: string } {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        'firstName' in obj &&
        'lastName' in obj &&
        'address' in obj
    );
}

type OrderItem = OrderWithDetails['items'][number];

export default function OrderSuccessClient({ order }: { order: OrderWithDetails }) {
  const shippingAddress = isShippingAddress(order.shippingAddress) ? order.shippingAddress : null;

  const shippingMethodDetails = {
    standard: { delivery: "5-7 business days" },
    express: { delivery: "2-3 business days" },
    priority: { delivery: "1 business day" },
  };

  const deliveryEstimate = order.shippingMethod?.toLowerCase().includes('express') ? shippingMethodDetails.express.delivery
                         : order.shippingMethod?.toLowerCase().includes('priority') ? shippingMethodDetails.priority.delivery
                         : shippingMethodDetails.standard.delivery;


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Thank you for your order!
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
          Order ID: <span className="font-medium text-gray-900 dark:text-gray-200">{order.id}</span>
        </p>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Delivery Estimate</h2>
        <div className="mt-4 bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-sm border border-transparent dark:border-slate-800">
          <DeliveryProgress
            orderCreatedAt={order.createdAt}
            deliveryEstimateString={deliveryEstimate}
          />
        </div>
      </div>

      <div className="mt-12 border-t border-gray-200 dark:border-gray-700">
        <h2 className="sr-only">Order details</h2>

        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            {order.items.map((item: OrderItem) => (
                <li key={item.id} className="flex py-6">
                    <div className="flex-shrink-0">
                        <Image
                            src={item.productVariant.image || ''}
                            alt={item.productVariant.product.title}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-md object-cover"
                        />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                        <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">{item.productVariant.product.title}</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.productVariant.name}</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="mt-2 font-medium text-gray-900 dark:text-white">${item.price.toFixed(2)}</p>
                    </div>
                </li>
            ))}
        </ul>

        <div className="bg-gray-100 dark:bg-slate-800/50 p-6 rounded-lg mt-6 border border-transparent dark:border-slate-800">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order Summary</h3>
            <dl className="mt-4 space-y-2 text-sm text-gray-800 dark:text-gray-300">
                <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-medium">${(order.grandTotal - (order.shippingCost ?? 0)).toFixed(2)}</dd></div>
                <div className="flex justify-between"><dt>Shipping</dt><dd className="font-medium">${(order.shippingCost ?? 0).toFixed(2)}</dd></div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 mt-2"><dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt><dd className="text-base font-bold text-gray-900 dark:text-white">${order.grandTotal.toFixed(2)}</dd></div>
            </dl>
        </div>

        {shippingAddress && (
            <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Shipping to</h3>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                    <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                    <p>{shippingAddress.email}</p>
                </div>
            </div>
        )}

        <div className="mt-8 text-center">
            <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium">
                Continue Shopping →
            </Link>
        </div>
      </div>
    </div>
  );
}