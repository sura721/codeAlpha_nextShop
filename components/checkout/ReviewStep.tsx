import { Loader2 } from "lucide-react";
import type { ReviewStepProps } from '@/lib/types';

export default function ReviewStep({ shippingData, shippingMethod, paymentData, onBack, onPlaceOrder, isPending }: ReviewStepProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Review Your Order</h2>
      <div className="mt-6 space-y-8">
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium text-gray-900">Shipping To</h3>
          <p className="text-sm text-gray-600">{shippingData.firstName} {shippingData.lastName}</p>
          <p className="text-sm text-gray-600">{shippingData.address}, {shippingData.city}, {shippingData.postalCode}</p>
          <p className="text-sm text-gray-600">{shippingData.email}</p>
        </div>
         <div className="p-4 border rounded-lg">
          <h3 className="font-medium text-gray-900">Shipping Method</h3>
          <p className="text-sm text-gray-600">{shippingMethod.name} ({shippingMethod.delivery})</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-medium text-gray-900">Payment Method</h3>
          <p className="text-sm text-gray-600">Card ending in **** {paymentData.cardNumber.slice(-4)}</p>
        </div>
      </div>
       <div className="flex items-center justify-between pt-6 mt-6 border-t">
          <button type="button" onClick={onBack} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Back to payment</button>
          <button onClick={onPlaceOrder} disabled={isPending} className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white py-3 px-6 font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
            {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            {isPending ? "Placing Order..." : "Place Your Order"}
          </button>
        </div>
    </div>
  )
}
// 6865cceb0517d4b9307480b6