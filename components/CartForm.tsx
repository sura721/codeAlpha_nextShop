"use client"

import { useCart } from "@/contexts/cart-context"
import Image from "next/image"
import Link from "next/link"
import { useState, useTransition } from "react"
import { Shield, RotateCcw } from "lucide-react"
import toast from "react-hot-toast"
import type { Cart as PrismaCart, CartItem, Product } from "@/lib/generated/prisma"

type CartItemWithProduct = CartItem & { product: Product };
type FullCart = PrismaCart & { items: CartItemWithProduct[] };

const shippingOptions = [
  { id: 'standard', name: 'Standard', price: 5.00, delivery: '4-10 business days' },
  { id: 'express', name: 'Express', price: 16.00, delivery: '2-5 business days' },
];

export default function CartForm({ initialCart }: { initialCart: FullCart }) {
  const { cart, removeItem, updateQuantity, isCartLoading } = useCart()
  const [selectedShipping, setSelectedShipping] = useState(shippingOptions[0]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const displayCart = isCartLoading ? initialCart : cart

  if (!displayCart || displayCart.items.length === 0) {
    return <p>Your cart is empty.</p>
  }

  const subtotal = displayCart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const taxes = subtotal * 0.07;
  const grandTotal = subtotal + selectedShipping.price + taxes - discount;

  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === 'DISCOUNT10') {
      const calculatedDiscount = subtotal * 0.10;
      setDiscount(calculatedDiscount);
      toast.success('Promo code applied!');
    } else {
      toast.error('Invalid promo code.');
      setDiscount(0);
    }
  };

  return (
    <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
      <section aria-labelledby="cart-heading" className="lg:col-span-7">
        <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
        <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
          {displayCart.items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="summary-heading"
        className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
      >
        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>
        <dl className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-600">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="flex items-center text-sm text-gray-600">
              <span>Shipping</span>
            </dt>
            <dd className="text-sm font-medium text-gray-900">${selectedShipping.price.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="text-sm text-gray-600">Estimated tax</dt>
            <dd className="text-sm font-medium text-gray-900">${taxes.toFixed(2)}</dd>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-green-600">
              <dt className="text-sm">Discount</dt>
              <dd className="text-sm font-medium">-${discount.toFixed(2)}</dd>
            </div>
          )}
          <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
            <dt className="text-base font-medium text-gray-900">Order total</dt>
            <dd className="text-base font-medium text-gray-900">${grandTotal.toFixed(2)}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <Link
            href="/checkout"
            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 flex justify-center"
          >
            Checkout
          </Link>
        </div>
        
        <div className="mt-6">
          <div className="mt-6">
            <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700">Promo Code</label>
            <div className="flex space-x-4 mt-1">
              <input
                type="text"
                id="promo-code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleApplyPromoCode}
                className="bg-gray-200 text-sm font-medium text-gray-700 rounded-md px-4 hover:bg-gray-300"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-6 space-y-4">
          <div className="flex items-center space-x-3 text-gray-600 text-sm"><Shield className="h-5 w-5 text-green-500" /><span>Secure Checkout Guaranteed</span></div>
          <div className="flex items-center space-x-3 text-gray-600 text-sm"><RotateCcw className="h-5 w-5 text-gray-500" /><span>30-Day Easy Returns</span></div>
        </div>

      </section>
    </div>
  )
}

function CartItemRow({ item }: { item: CartItemWithProduct }) {
  const { removeItem, updateQuantity } = useCart();
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(() => {
      removeItem(item.productId);
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = Number(e.target.value);
    startTransition(() => {
        updateQuantity(item.productId, newQuantity);
    });
  };

  return (
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <Image
          src={item.product.images[0] || '/placeholder.svg'}
          alt={item.product.title}
          width={150}
          height={150}
          className="w-24 h-24 rounded-md object-center object-cover sm:w-36 sm:h-36"
        />
      </div>
      <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
        <div>
          <div className="flex justify-between font-medium text-gray-900">
            <h3>
              <Link href={`/products/${item.product.slug}`}>{item.product.title}</Link>
            </h3>
            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">Unit Price: ${item.price.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-sm">
            <div className={`w-2.5 h-2.5 rounded-full ${item.product.inStock > 0 ? "bg-green-500" : "bg-red-500"}`} />
            <p className="ml-2 text-gray-500">{item.product.inStock > 0 ? 'In Stock' : 'Out of Stock'}</p>
          </div>
        </div>
        <div className="mt-4 flex-1 flex items-end justify-between text-sm">
          <div className="flex items-center">
            <label htmlFor={`quantity-${item.id}`} className="mr-2 text-gray-500">Qty</label>
            <select
              id={`quantity-${item.id}`}
              name={`quantity-${item.id}`}
              value={item.quantity}
              onChange={handleQuantityChange}
              disabled={isPending}
              className="rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {[...Array(Math.min(item.product.inStock, 10)).keys()].map(x => (
                <option key={x + 1} value={x + 1}>{x + 1}</option>
              ))}
            </select>
          </div>
          <div className="flex">
            <button
              type="button"
              onClick={handleRemove}
              disabled={isPending}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}