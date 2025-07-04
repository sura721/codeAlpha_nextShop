import Image from 'next/image';
import type { CartWithDetails } from '@/lib/types';

type OrderSummaryProps = {
  cart: CartWithDetails;
  shippingMethod: { price: number };
};

export default function OrderSummary({ cart, shippingMethod }: OrderSummaryProps) {
  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.05;
  const total = subtotal + taxes + shippingMethod.price;

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-lg shadow-lg p-6 border border-transparent dark:border-slate-800">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>
      <ul role="list" className="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
        {cart.items.map(item => (
          <li key={item.id} className="flex py-4">
            <div className="flex-shrink-0">
              <Image
                src={item.productVariant.image || ''}
                alt={item.productVariant.product.title}
                width={64}
                height={64}
                className="w-16 h-16 rounded-md object-cover"
              />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{item.productVariant.product.title}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.productVariant.name}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
              </div>
              <div className="flex flex-1 items-end justify-between text-sm">
                <p className="font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <dl className="mt-6 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between"><dt className="text-sm text-gray-600 dark:text-gray-300">Subtotal</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</dd></div>
        <div className="flex items-center justify-between"><dt className="text-sm text-gray-600 dark:text-gray-300">Shipping</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">${shippingMethod.price.toFixed(2)}</dd></div>
        <div className="flex items-center justify-between"><dt className="text-sm text-gray-600 dark:text-gray-300">Taxes</dt><dd className="text-sm font-medium text-gray-900 dark:text-white">${taxes.toFixed(2)}</dd></div>
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4"><dt className="text-base font-bold text-gray-900 dark:text-white">Order total</dt><dd className="text-base font-bold text-gray-900 dark:text-white">${total.toFixed(2)}</dd></div>
      </dl>
    </div>
  );
}