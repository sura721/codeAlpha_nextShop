import type { ShippingStepProps } from '@/lib/types';

export default function ShippingStep({ shippingData, setShippingData, onSuccess }: ShippingStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input type="email" placeholder="Email" value={shippingData.email} onChange={e => setShippingData({...shippingData, email: e.target.value})} required className="w-full rounded-md border-gray-300" />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="First Name" value={shippingData.firstName} onChange={e => setShippingData({...shippingData, firstName: e.target.value})} required className="w-full rounded-md border-gray-300" />
          <input type="text" placeholder="Last Name" value={shippingData.lastName} onChange={e => setShippingData({...shippingData, lastName: e.target.value})} required className="w-full rounded-md border-gray-300" />
        </div>
        <input type="text" placeholder="Address" value={shippingData.address} onChange={e => setShippingData({...shippingData, address: e.target.value})} required className="w-full rounded-md border-gray-300" />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="City" value={shippingData.city} onChange={e => setShippingData({...shippingData, city: e.target.value})} required className="w-full rounded-md border-gray-300" />
          <input type="text" placeholder="Postal Code" value={shippingData.postalCode} onChange={e => setShippingData({...shippingData, postalCode: e.target.value})} required className="w-full rounded-md border-gray-300" />
        </div>
        <button type="submit" className="w-full rounded-md bg-indigo-600 text-white py-3 font-semibold hover:bg-indigo-700">Continue to Payment</button>
      </form>
    </div>
  );
}