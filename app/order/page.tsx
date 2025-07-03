 
import Link from 'next/link';
import { getOrdersForUser } from '@/lib/actions/order.actions';
import { Badge } from '@/components/ui/badge'; 

export const metadata = {
  title: 'My Orders - NextShop',
};

export default async function MyOrdersPage() {
  const orders = await getOrdersForUser();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        My Orders
      </h1>
      
      {orders.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
          <h2 className="text-xl font-medium text-gray-900">You haven&apos;t placed any orders yet.</h2>
          <p className="mt-2 text-gray-500">When you do, your orders will appear here.</p>
          <Link href="/" className="mt-6 inline-block bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-gray-800">Order ID</h2>
                  <p className="text-sm text-gray-500 font-mono">{order.id}</p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">Date Placed</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">Total</h2>
                  <p className="text-sm text-gray-500 font-medium">${order.grandTotal.toFixed(2)}</p>
                </div>
                <div>
                  <Badge 
                    variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}
                    className={order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
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