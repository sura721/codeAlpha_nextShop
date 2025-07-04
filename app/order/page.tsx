import Link from 'next/link';
import { getOrdersForUser } from '@/lib/actions/order.actions';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'My Orders - pingShop',
};

export default async function MyOrdersPage() {
  const orders = await getOrdersForUser();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center bg-white dark:bg-slate-800/50 p-12 rounded-lg shadow-md border border-transparent dark:border-slate-800">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white">You haven&apos;t placed any orders yet.</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">When you do, your orders will appear here.</p>
          <Link href="/" className="mt-6 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-slate-800/50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-transparent dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-gray-200">Order ID</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{order.id}</p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-gray-200">Date Placed</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 dark:text-gray-200">Total</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">${order.grandTotal.toFixed(2)}</p>
                </div>
                <div>
                  <Badge
                    variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}
                    className={
                      order.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
                <Link
                  href={`/order/${order.id}`}
                  className="bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 whitespace-nowrap"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}