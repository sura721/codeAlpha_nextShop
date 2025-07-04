import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping Policy - pingShop',
  description: 'Learn about the shipping capabilities of the pingShop platform, ready for customization for your business.',
};

export default function ShippingPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-800/50 p-8 rounded-lg shadow-md border border-transparent dark:border-slate-800">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Shipping Commitment</h1>
        
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="font-semibold">This page demonstrates the shipping policy feature of the pingShop platform.</p>
          
          <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
            <h2 className="font-bold text-gray-800 dark:text-gray-100">Demo Site Policy:</h2>
            <p>For this demonstration, we simulate a standard delivery timeline of 2-5 business days., with complimentary free shipping on all orders over $100.</p>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">For Your Business</h2>
            <p className="mt-2">
              This platform is ready to be customized with a robust, real-world shipping strategy tailored to your needs. We can integrate:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Real-time shipping rate calculators from major carriers.</li>
              <li>Custom shipping zones and rules (e.g., local delivery, international).</li>
              <li>Flat-rate, free shipping thresholds, and weight-based shipping.</li>
              <li>Automated shipping notifications for your customers.</li>
            </ul>
          </div>
          
          <p className="pt-4 font-medium">
            Ready to build an online store with a shipping strategy that works for you?
            <Link href="/contact" className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
              Let&apos;s talk.
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}