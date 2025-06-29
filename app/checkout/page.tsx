'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Lock } from 'lucide-react';
import { shippingOptions } from '@/lib/mock-data';
// const shippingOptions = [
//   { id: 'standard', name: 'Standard Shipping', delivery: 'Arrives in 5-7 days', price: 5.00 },
//   { id: 'priority', name: 'Priority Shipping', delivery: 'Arrives in 3-5 days', price: 10.00 },
//   { id: 'express', name: 'Express Shipping', delivery: 'Arrives in 1-3 days', price: 15.00 },
// ];

const mockCartItems = [
  { productId: 'clxyz123', title: 'Quantum-Flux T-Shirt', price: 29.99, quantity: 2, image: 'https://via.placeholder.com/150/92c952' },
  { productId: 'clxyz456', title: 'Gravity-Defying Sneakers', price: 129.99, quantity: 1, image: 'https://via.placeholder.com/150/771796' },
];

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);

  const subtotal = mockCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + selectedShipping.price;

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    console.log("Payment processed!");
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-4">Checkout</h1>
          <p className="text-slate-600 mb-10">Complete your order by providing your details below.</p>
          
          <form onSubmit={handlePayment} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div className="flex flex-col space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-4">Contact & Shipping</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email-address" className="block text-sm font-medium text-slate-700">Email address</label>
                    <input type="email" id="email-address" name="email-address" autoComplete="email" required className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full name</label>
                    <input type="text" id="name" name="name" autoComplete="name" required className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
                    <input type="text" name="address" id="address" autoComplete="street-address" required className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-slate-700">City</label>
                      <input type="text" name="city" id="city" required className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
                    </div>
                    <div>
                      <label htmlFor="postal-code" className="block text-sm font-medium text-slate-700">Postal code</label>
                      <input type="text" name="postal-code" id="postal-code" required className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"/>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-4">Delivery Method</h2>
                <div className="space-y-4">
                  {shippingOptions.map((option, index) => (
                    <div key={option.id} className="flex items-center p-4 border border-slate-200 rounded-md has-[:checked]:bg-purple-50 has-[:checked]:border-purple-300">
                      <input 
                        id={option.id}
                        type="radio" 
                        name="delivery-method" 
                        value={option.id}
                        checked={selectedShipping.id === option.id} 
                        onChange={() => setSelectedShipping(option)}
                        className="h-4 w-4 text-purple-600 border-slate-300 focus:ring-purple-500 accent-purple-600"
                      />
                      <label htmlFor={option.id} className="ml-3 flex flex-col cursor-pointer flex-grow">
                        <span className="block text-sm font-semibold text-slate-800">{option.name}</span>
                        <span className="block text-sm text-slate-500">{option.delivery}</span>
                      </label>
                       <span className="text-sm font-semibold text-slate-800">${option.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-4">Payment Details</h2>
                <div className="h-40 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                  <p className="text-sm text-slate-500 text-center px-4">
                    Secure payment provider (e.g., Stripe) will be integrated here.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 sticky top-24">
                <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-4 mb-4">Order Summary</h2>
                <ul role="list" className="divide-y divide-slate-200">
                  {mockCartItems.map((item) => (
                    <li key={item.productId} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                        <Image src={item.image} alt={item.title} width={96} height={96} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-slate-900">
                            <h3>{item.title}</h3>
                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="border-t border-slate-200 pt-6 space-y-4">
                  <div className="flex items-center justify-between"><dt className="text-sm text-slate-600">Subtotal</dt><dd className="text-sm font-medium text-slate-900">${subtotal.toFixed(2)}</dd></div>
                  <div className="flex items-center justify-between"><dt className="text-sm text-slate-600">Shipping</dt><dd className="text-sm font-medium text-slate-900">${selectedShipping.price.toFixed(2)}</dd></div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-medium text-slate-900">
                    <dt>Total</dt>
                    <dd>${total.toFixed(2)}</dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <button type="submit" disabled={isProcessing} className="w-full bg-purple-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed flex items-center justify-center">
                    {isProcessing ? (<Loader2 className="mr-2 h-5 w-5 animate-spin" />) : (<Lock className="mr-2 h-4 w-4" />)}
                    {isProcessing ? 'Processing...' : `Pay Securely $${total.toFixed(2)}`}
                  </button>
                </div>
                <div className="mt-6 text-center text-sm text-slate-500">
                  <p>or <Link href="/products" className="font-medium text-purple-600 hover:text-purple-500">Continue Shopping</Link></p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}