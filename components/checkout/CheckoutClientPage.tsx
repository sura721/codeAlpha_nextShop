// components/checkout/CheckoutClientPage.tsx

"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import type { CartWithDetails } from '@/lib/types';
import { createOrder } from '@/lib/actions/order.actions';
import { useCart } from '@/contexts/cart-context';
import ShippingStep from './ShippingStep';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';
import OrderSummary from './OrderSummary';

type CheckoutStep = 'shipping' | 'payment' | 'review';

export default function CheckoutClientPage({ cart }: { cart: CartWithDetails }) {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { clearTheCart } = useCart(); // 2. Get the function from the context

  const [shippingData, setShippingData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [shippingMethod, setShippingMethod] = useState({
    id: 'standard',
    name: 'Standard Shipping',
    price: 5.00,
    delivery: '5-7 business days',
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvc: '',
  });

  const handlePlaceOrder = () => {
    if (!cart || !shippingData || !shippingMethod) {
        toast.error("Missing order information.");
        return;
    }

    startTransition(async () => {
      toast.loading("Placing your order...");

      const result = await createOrder(cart, shippingData, shippingMethod);
      
      toast.dismiss();

      if (result.success && result.orderId) {
        toast.success("Order placed successfully!");
        clearTheCart(); // 3. Simply call the function. It does all the work.
        router.push(`/order/${result.orderId}`);
      } else {
        toast.error(result.error || "Failed to place order. Please try again.");
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <div className="lg:col-span-7">
          {step === 'shipping' && (
            <ShippingStep
              shippingData={shippingData}
              setShippingData={setShippingData}
              onSuccess={() => setStep('payment')}
            />
          )}
          {step === 'payment' && (
            <PaymentStep
              paymentData={paymentData}
              setPaymentData={setPaymentData}
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
              onBack={() => setStep('shipping')}
              onSuccess={() => setStep('review')}
            />
          )}
          {step === 'review' && (
            <ReviewStep
              shippingData={shippingData}
              shippingMethod={shippingMethod}
              paymentData={paymentData}
              onBack={() => setStep('payment')}
              onPlaceOrder={handlePlaceOrder}
              isPending={isPending}
            />
          )}
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-24 mt-16 lg:mt-0">
          <OrderSummary cart={cart} shippingMethod={shippingMethod} />
        </div>
      </div>
    </div>
  );
}