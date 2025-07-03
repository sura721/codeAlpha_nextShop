"use client"

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {type CartWithDetails } from '@/lib/types';
import { updateCartItemQuantity, removeCartItem } from '@/lib/actions/cart.actions';
import { redirect } from 'next/navigation';

type CartFormProps = {
  initialCart: CartWithDetails;
};

export default function CartForm({ initialCart }: CartFormProps) {
  const [cart, setCart] = useState(initialCart);
  const [isPending, startTransition] = useTransition();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    startTransition(async () => {
      if (newQuantity < 1) return;
      const result = await updateCartItemQuantity(itemId, newQuantity);
      if (result.success) {
        setCart(prevCart => ({
          ...prevCart,
          items: prevCart.items.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        }));
      } else {
        toast.error(result.error || "Failed to update quantity.");
      }
    });
  };
  
  const handleRemoveItem = (itemId: string) => {
    startTransition(async () => {
      const result = await removeCartItem(itemId);
       if (result.success) {
        setCart(prevCart => ({ ...prevCart, items: prevCart.items.filter(item => item.id !== itemId) }));
        toast.success("Item removed from cart.");
      } else {
        toast.error(result.error || "Failed to remove item.");
      }
    });
  };

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
      <section aria-labelledby="cart-heading" className="lg:col-span-7">
         <ul role="list" className="divide-y divide-gray-200 border-y border-gray-200">
          {cart.items.map((item) => {
            const maxQty = Math.min(10, item.productVariant.inStock);
            return (
              <li key={item.id} className="flex py-6">
                <div className="flex-shrink-0">
                  <Image
                    src={item.productVariant.image || '/placeholder.svg'}
                    alt={item.productVariant.product.title}
                    width={128}
                    height={128}
                    className="h-24 w-24 sm:h-32 sm:w-32 rounded-lg object-cover"
                  />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div>
                    <div className="flex justify-between font-medium text-gray-900">
                      <h3>
                        <Link href={`/products/${item.productVariant.product.slug}`}>
                          {item.productVariant.product.title}
                        </Link>
                      </h3>
                      <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.productVariant.name}</p>
                    <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex flex-1 items-center justify-between text-sm mt-4">
                    <div className="flex items-center">
                      <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
                      <select
                        id={`quantity-${item.id}`}
                        name={`quantity-${item.id}`}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                        disabled={isPending}
                        className="rounded-md border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                      >
                        {Array.from({ length: maxQty }, (_, i) => i + 1).map(q => (
                          <option key={q} value={q}>{q}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex">
                      <button type="button" onClick={() => handleRemoveItem(item.id)} disabled={isPending} className="font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="mt-6">
            <Link href="/products" className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
            </Link>
        </div>
      </section>

      <section
        aria-labelledby="summary-heading"
        className="lg:sticky lg:top-24 mt-16 rounded-lg bg-white shadow-lg p-6 lg:col-span-5 lg:mt-0"
      >
        <h2 id="summary-heading" className="text-xl font-bold text-gray-900">
          Order Summary
        </h2>
        <dl className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-600">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
          </div>
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
            <dt className="text-base font-medium text-gray-900">Order total</dt>
            <dd className="text-base font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <button
            type="button"
            onClick={()=>redirect('/checkout')}
            disabled={isPending}
            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
            Proceed to Secure Checkout
          </button>
        </div>
      </section>
    </div>
  );
}