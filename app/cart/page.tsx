'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { shippingOptions } from '@/lib/mock-data';


const mockCartItems = [
  { id: 1, name: 'Cool T-Shirt', price: 29.99, quantity: 2 },
  { id: 2, name: 'Stylish Jeans', price: 89.99, quantity: 1 },
];

export default function CartPage() {
  const cartIsEmpty = mockCartItems.length === 0;

  // --- CALCULATE COSTS BASED ON DEFAULT SHIPPING ---
  const subtotal = mockCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const defaultShipping = shippingOptions[0]; // Use the cheapest option for the estimate
  const estimatedTotal = subtotal + defaultShipping.price;

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Shopping Cart</h1>
        
        {cartIsEmpty ? (
          <div className="mt-12">
            <p className="text-slate-600">Your cart is empty.</p>
            <Link href="/products" className="mt-4 inline-block text-purple-600 font-medium hover:text-purple-500">
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
              <ul role="list" className="border-t border-b border-slate-200 divide-y divide-slate-200">
                {mockCartItems.map(item => (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    {/* Placeholder for item image */}
                    <div className="flex-shrink-0">
                      <div className="h-24 w-24 rounded-md bg-slate-200 sm:h-48 sm:w-48"></div>
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <span className="font-medium text-slate-700 hover:text-slate-800">{item.name}</span>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm font-medium text-slate-900">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity, {item.name}</label>
                          <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            
            <section aria-labelledby="summary-heading" className="mt-16 bg-slate-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:col-span-5 lg:mt-0">
              <h2 id="summary-heading" className="text-lg font-medium text-slate-900">Order Summary</h2>
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-slate-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-slate-900">${subtotal.toFixed(2)}</dd>
                </div>
                {/* --- NEW SHIPPING ESTIMATE --- */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                  <dt className="flex items-center text-sm text-slate-600">
                    <span>Shipping estimate</span>
                  </dt>
                  <dd className="text-sm font-medium text-slate-900">${defaultShipping.price.toFixed(2)}</dd>
                </div>
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                  <dt className="text-base font-medium text-slate-900">Estimated Total</dt>
                  <dd className="text-base font-medium text-slate-900">${estimatedTotal.toFixed(2)}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <Link href="/checkout">
                  <button className="w-full bg-purple-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center gap-2">
                    <ShoppingCart size={20} />
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}