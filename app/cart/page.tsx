import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import CartForm from '@/components/CartForm';
import { getCart } from '@/lib/actions/cart.actions';

export const metadata = {
  title: 'Shopping Cart - NextShop',
};

export default async function CartPage() {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-white">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Your cart is empty
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Looks like you haven&apos;t added anything to your cart yet. Start exploring our products to find something you&apos;ll love.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-8 lg:mb-12">
          Shopping Cart
        </h1>
        <CartForm initialCart={cart} />
      </div>
    </div>
  );
}