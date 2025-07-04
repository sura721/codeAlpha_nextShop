import { Loader2 } from "lucide-react";
import type { ReviewStepProps } from '@/lib/types';

export default function ReviewStep({ shippingData, shippingMethod, paymentData, onBack, onPlaceOrder, isPending }: ReviewStepProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review Your Order</h2>
      <div className="mt-6 space-y-8">
        <div className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-800/50">
          <h3 className="font-medium text-gray-900 dark:text-white">Shipping To</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{shippingData.firstName} {shippingData.lastName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{shippingData.address}, {shippingData.city}, {shippingData.postalCode}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{shippingData.email}</p>
        </div>
        <div className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-800/50">
          <h3 className="font-medium text-gray-900 dark:text-white">Shipping Method</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{shippingMethod.name} ({shippingMethod.delivery})</p>
        </div>
        <div className="p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-800/50">
          <h3 className="font-medium text-gray-900 dark:text-white">Payment Method</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Card ending in **** {paymentData.cardNumber.slice(-4)}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-6 mt-6 border-t dark:border-gray-700">
        <button type="button" onClick={onBack} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">Back to payment</button>
        <button onClick={onPlaceOrder} disabled={isPending} className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white py-3 px-6 font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
          {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
          {isPending ? "Placing Order..." : "Place Your Order"}
        </button>
      </div>
    </div>
  )
}