'use client';

import { useState, useTransition } from 'react';
import { OrderStatus } from '@/lib/generated/prisma';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { updateOrderStatus } from '@/lib/actions/order.actions';
import { Loader2 } from 'lucide-react';

interface UpdateOrderStatusProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export default function UpdateOrderStatus({
  orderId,
  currentStatus,
}: UpdateOrderStatusProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>(currentStatus);

  const handleUpdate = () => {
    startTransition(async () => {
      await updateOrderStatus(orderId, selectedStatus);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedStatus}
        onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
        disabled={isPending}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(OrderStatus).map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleUpdate}
        disabled={isPending || selectedStatus === currentStatus}
      >
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save
      </Button>
    </div>
  );
}