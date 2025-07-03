import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';
import UpdateOrderStatus from './UpdateOrderStatus';
import prisma from '@/lib/prisma';

const formatCurrency = (amount: number | null) => {
  if (amount === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const {orderId} = await params
  const order = await prisma.order.findUnique({
    where: { id:orderId },
    include: {
      items: {
        include: {
          productVariant: true,
        },
      },
      user: true,
    },
  });

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shippingAddress as unknown as ShippingAddress | null;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Order Details - #{order.id.slice(-6).toUpperCase()}
            </CardTitle>
            <CardDescription>
              Placed on {formatDate(order.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.productVariant.image}
                          alt={item.productVariant.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">
                            {item.productVariant.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            SKU: {item.productVariant.sku}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.price * item.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{order.user.name}</p>
            <p className="text-muted-foreground">{order.user.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {shippingAddress ? (
              <>
                <p>
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </p>
              </>
            ) : (
              <p>No shipping address provided.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal & Tax</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Grand Total</span>
              <span>{formatCurrency(order.grandTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}