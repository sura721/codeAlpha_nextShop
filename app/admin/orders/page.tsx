import Link from 'next/link';
import prisma from '@/lib/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { OrderStatus } from '@/lib/generated/prisma';

function getStatusVariant(status: OrderStatus) {
  switch (status) {
    case 'PENDING':
      return 'secondary';
    case 'PROCESSING':
      return 'default';
    case 'SHIPPED':
      return 'default';
    case 'DELIVERED':
      return 'default';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case 'PROCESSING':
      return 'bg-yellow-500 hover:bg-yellow-500/90';
    case 'SHIPPED':
      return 'bg-blue-500 hover:bg-blue-500/90';
    case 'DELIVERED':
      return 'bg-green-600 hover:bg-green-600/90';
    default:
      return '';
  }
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>A list of all the orders placed.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  #{order.id.slice(-6).toUpperCase()}
                </TableCell>
                <TableCell>{order.user.name || order.user.email}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(order.status)}
                    className={getStatusColor(order.status)}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(order.grandTotal)}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/orders/${order.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}