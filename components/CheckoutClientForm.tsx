"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Lock, ChevronDown, ChevronUp } from 'lucide-react'
import type { Cart as PrismaCart, CartItem, Product } from '@/lib/generated/prisma'

// Define the types for our cart data
type CartItemWithProduct = CartItem & { product: Product };
type FullCart = PrismaCart & { items: CartItemWithProduct[] };

// --- Reusable Form Input Component ---
function FormInput({ id, label, type = "text", placeholder, autoComplete }: { id: string, label: string, type?: string, placeholder?: string, autoComplete?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  )
}

// --- Main Checkout Form Component ---
export default function CheckoutClientForm({ cart }: { cart: FullCart }) {
  const [isBillingSameAsShipping, setIsBillingSameAsShipping] = useState(true);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // Example tax and shipping, you can make this dynamic
  const shipping = 5.00;
  const taxes = subtotal * 0.07;
  const total = subtotal + shipping + taxes;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This is where you would call your server action to process the payment
    // e.g., processCheckout(new FormData(e.currentTarget));
    console.log("Form submitted!");
  };

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          {/* Mobile Order Summary (Accordion) */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              <button onClick={() => setIsSummaryExpanded(!isSummaryExpanded)} className="font-medium text-indigo-600 hover:text-indigo-500">
                {isSummaryExpanded ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            {isSummaryExpanded && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <OrderSummary cart={cart} shipping={shipping} taxes={taxes} total={total} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            {/* Column 1: Contact and Shipping Info */}
            <div className="mt-10 lg:mt-0">
              <div>
                <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
                <div className="mt-4">
                  <FormInput id="email-address" label="Email address" type="email" autoComplete="email" />
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div className="sm:col-span-2">
                    <FormInput id="name" label="Full name" autoComplete="name" />
                  </div>
                  <div className="sm:col-span-2">
                    <FormInput id="address" label="Address" autoComplete="street-address" />
                  </div>
                  <div className="sm:col-span-2">
                    <FormInput id="apartment" label="Apartment, suite, etc. (Optional)" />
                  </div>
                  <FormInput id="city" label="City" autoComplete="address-level2" />
                  <FormInput id="region" label="State / Province" autoComplete="address-level1" />
                  <FormInput id="postal-code" label="Postal code" autoComplete="postal-code" />
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <fieldset>
                  <legend className="text-lg font-medium text-gray-900">Payment</legend>
                  <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
                    <div className="col-span-4">
                      <FormInput id="card-number" label="Card number" placeholder="XXXX XXXX XXXX XXXX" />
                    </div>
                    <div className="col-span-4">
                      <FormInput id="name-on-card" label="Name on card" />
                    </div>
                    <div className="col-span-3">
                      <FormInput id="expiration-date" label="Expiration date (MM/YY)" placeholder="MM / YY" />
                    </div>
                    <div>
                      <FormInput id="cvc" label="CVC" placeholder="XXX" />
                    </div>
                  </div>
                </fieldset>
                <div className="mt-6 flex items-center text-sm text-gray-500">
                    <Lock className="mr-2 h-4 w-4 text-gray-400" />
                    <p>Your payment information is encrypted and secure.</p>
                </div>
              </div>
            </div>

            {/* Column 2: Order Summary (Desktop) */}
            <div className="mt-10 hidden lg:block">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <OrderSummary cart={cart} shipping={shipping} taxes={taxes} total={total} />
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <button
                    type="submit"
                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
             {/* Mobile-only Place Order Button */}
             <div className="lg:hidden mt-10">
                <button
                    type="submit"
                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Place Order
                  </button>
             </div>
          </form>
        </div>
      </main>
    </div>
  )
}


// --- Reusable Order Summary Component ---
function OrderSummary({ cart, shipping, taxes, total }: { cart: FullCart, shipping: number, taxes: number, total: number }) {
  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return (
    <>
      <ul role="list" className="divide-y divide-gray-200 px-4 sm:px-6">
        {cart.items.map((item) => (
          <li key={item.id} className="flex py-6">
            <div className="flex-shrink-0">
              <Image
                src={item.product.images[0]}
                alt={item.product.title}
                width={80}
                height={80}
                className="w-20 rounded-md"
              />
            </div>
            <div className="ml-6 flex flex-1 flex-col">
              <div className="flex">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-medium text-gray-800">{item.product.title}</h4>
                  <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="flex flex-1 items-end justify-between">
                <p className="mt-1 text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between">
          <dt className="text-sm">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm">Shipping</dt>
          <dd className="text-sm font-medium text-gray-900">${shipping.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm">Taxes</dt>
          <dd className="text-sm font-medium text-gray-900">${taxes.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-300 pt-6 text-base font-medium text-gray-900">
          <dt>Total</dt>
          <dd>${total.toFixed(2)}</dd>
        </div>
      </dl>
    </>
  )
}