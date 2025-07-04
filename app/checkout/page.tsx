import { redirect } from 'next/navigation';
import { getCart } from '@/lib/actions/cart.actions';
import CheckoutClientPage from '@/components/checkout/CheckoutClientPage';

export const metadata = {
  title: 'Secure Checkout - pingShop',
};

export default async function CheckoutPage() {
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    redirect('/cart');
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <CheckoutClientPage cart={cart} />
    </div>
  );
}