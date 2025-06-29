import { OrderStatus } from '@/lib/generated/prisma';
import prisma from '@/lib/prisma';
import OrderStatusUpdater from '../OrderStatusUpdater';

// Helper component for colored status badges
function StatusBadge({ status }: { status: OrderStatus }) {
  const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: true, // Include user data to show customer name/email
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return orders;
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Orders</h1>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600">Order ID</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Customer</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Total</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 text-xs font-mono text-slate-500">{order.id}</td>
                  <td className="p-4 text-sm font-medium text-slate-800">{order.user.name || order.user.email}</td>
                  <td className="p-4 text-sm text-slate-600">{order.createdAt.toLocaleDateString()}</td>
                  <td className="p-4 text-sm text-slate-600">${order.total.toFixed(2)}</td>
                  <td className="p-4"><StatusBadge status={order.status} /></td>
                  <td className="p-4"><OrderStatusUpdater orderId={order.id} currentStatus={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono text-slate-500">{order.id}</p>
                <p className="font-semibold text-slate-800">{order.user.name || order.user.email}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">{order.createdAt.toLocaleDateString()}</span>
              <span className="font-bold text-slate-800">${order.total.toFixed(2)}</span>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-500">No orders have been placed yet.</p>
        </div>
      )}
    </div>
  );
}