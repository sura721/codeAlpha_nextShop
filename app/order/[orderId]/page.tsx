 
import { redirect } from 'next/navigation';
import { getOrderDetails, OrderWithDetails } from '@/lib/actions/order.actions';
import OrderSuccessClient from '@/components/order/OrderSuccessClient';
 
 export async function generateMetadata({ params }: { params: Promise<{ orderId: string }> }) {
    const {orderId} = await params
  return {
    title: `Order Details #${orderId} - pingShop`,
  };
}

 function OrderDetailsDisplay({ order }: { order: OrderWithDetails }) {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Order Details
        </h1>
        <p className="text-base text-gray-500 mt-2">
          Order ID: <span className="font-medium text-gray-900">{order.id}</span>
        </p>
      </div>
       <OrderSuccessClient order={order} />
    </>
  );
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  if (!orderId) {
    redirect('/orders');
  }

  const order = await getOrderDetails(orderId);

  if (!order) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Order Not Found</h1>
        <p className="text-gray-600 mt-2">
          We couldn&apos;t find this order, or you don&apos;t have permission to view it.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <OrderDetailsDisplay order={order} />
    </div>
  );
}