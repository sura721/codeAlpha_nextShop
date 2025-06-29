'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatus } from '@/lib/actions/order.actions';
import { Loader2 } from 'lucide-react';
import { OrderStatus } from '@/lib/generated/prisma';

type OrderStatusUpdaterProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

export default function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    startTransition(() => {
      updateOrderStatus(orderId, selectedStatus);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
        className="block w-full p-2 text-sm border border-slate-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white"
      >
        {Object.values(OrderStatus).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={isPending || selectedStatus === currentStatus}
        className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md shadow-sm hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
      </button>
    </div>
  );
}