import { PaymentStepProps } from '@/lib/types';

const SHIPPING_METHODS = [
    { id: 'standard', name: 'Standard Shipping', price: 5.00, delivery: '5-7 business days' },
    { id: 'express', name: 'Express Shipping', price: 15.00, delivery: '2-3 business days' },
    { id: 'priority', name: 'Priority Shipping', price: 25.00, delivery: '1 business day' },
];

export default function PaymentStep({ paymentData, setPaymentData, shippingMethod, setShippingMethod, onBack, onSuccess }: PaymentStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment & Shipping</h2>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Shipping Method</h3>
        <div className="mt-4 space-y-4">
          {SHIPPING_METHODS.map(method => (
            <div key={method.id} onClick={() => setShippingMethod(method)} className="flex items-center p-4 border dark:border-gray-700 rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 bg-gray-50 dark:bg-slate-800/50">
              <input type="radio" id={method.id} name="shippingMethod" checked={shippingMethod.id === method.id} readOnly className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700" />
              <label htmlFor={method.id} className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="font-bold text-gray-900 dark:text-white">{method.name} - ${method.price.toFixed(2)}</span>
                <span className="block text-gray-500 dark:text-gray-400">{method.delivery}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Payment Details (Demo)</h3>
        <input type="text" placeholder="Card Number (e.g., 4242 4242...)" value={paymentData.cardNumber} onChange={e => setPaymentData({ ...paymentData, cardNumber: e.target.value })} required className="w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700" />
        <input type="text" placeholder="Name on Card" value={paymentData.cardName} onChange={e => setPaymentData({ ...paymentData, cardName: e.target.value })} required className="w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700" />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Expiry Date (MM/YY)" value={paymentData.expiryDate} onChange={e => setPaymentData({ ...paymentData, expiryDate: e.target.value })} required className="w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700" />
          <input type="text" placeholder="CVC" value={paymentData.cvc} onChange={e => setPaymentData({ ...paymentData, cvc: e.target.value })} required className="w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-700" />
        </div>
        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={onBack} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">Back to shipping</button>
          <button type="submit" className="rounded-md bg-indigo-600 text-white py-3 px-6 font-semibold hover:bg-indigo-700">Continue to Review</button>
        </div>
      </form>
    </div>
  )
}