import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Returns Policy - pingShop',
  description: 'Learn about the flexible returns and exchanges system available on the pingShop platform.',
};

export default function ReturnsPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-800/50 p-8 rounded-lg shadow-md border border-transparent dark:border-slate-800">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Hassle-Free Returns</h1>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p className="font-semibold">This page demonstrates the returns policy feature of the pingShop platform.</p>

          <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-md">
            <h2 className="font-bold text-gray-800 dark:text-gray-100">Demo Site Policy:</h2>
            <p>For this demonstration, we simulate a 7-day return window for items that are defective or incorrect, provided they are in their original packaging.</p>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">For Your Business</h2>
            <p className="mt-2">
              A clear and fair return policy builds customer trust. We can customize this platform to include:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>A self-service returns portal for your customers.</li>
              <li>Customizable return reasons and conditions.</li>
              <li>Automated return status updates (e.g., &quot;Return Received,&quot; Refund Processed&quot;).</li>
              <li>Options for store credit, exchanges, or refunds to the original payment method.</li>
            </ul>
          </div>
          
          <p className="pt-4 font-medium">
            Let&apos;s build a trustworthy brand with a clear and customer-friendly return policy.
            <Link href="/contact" className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
              Get in touch.
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}