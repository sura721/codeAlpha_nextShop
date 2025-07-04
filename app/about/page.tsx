import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Ping Shop',
  description: 'Learn about Ping Shop, our mission, and the powerful e-commerce platform it\'s built on by full-stack engineer Surafel Admas.',
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          About Ping Shop 🛍️
        </h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          Welcome to <span className="font-semibold text-gray-900 dark:text-gray-100">Ping Shop</span> — your destination for curated modern apparel, electronics, and unique gadgets.
        </p>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg text-center">
        At Ping Shop, we believe finding high-quality, innovative products should be simple and exciting. We carefully select every item in our collection to ensure it meets our high standards of quality, design, and functionality.
      </p>

      <div className="space-y-3 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-transparent dark:border-slate-800">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Why Choose Ping Shop?
        </h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-lg space-y-1">
          <li>🚚 Fast and reliable delivery</li>
          <li>✅ A straightforward return policy for your peace of mind</li>
          <li>💬 Friendly and responsive customer support ready to help</li>
        </ul>
      </div>

      <div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg text-center">
          Ping Shop is proudly owned by <span className="font-semibold text-gray-900 dark:text-gray-100">Surafel Admas</span>, a full-stack engineer dedicated to building reliable and user-friendly online experiences.
        </p>
      </div>

      <div className="text-center p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">A Platform Built for Growth</h2>
        <p className="mt-3 text-gray-700 dark:text-gray-300">
          This website is more than just a store; it&apos;s a demonstration of a powerful, production-ready e-commerce platform. It was built from the ground up by Surafel Admas to be fast, secure, and fully customizable.
        </p>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          If you are looking for a similar high-performance website for your business, this platform can be tailored with real payment gateways (Stripe, Chapa, etc.), shipping logistics, and your unique branding.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link
          href="/contact"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-indigo-700 transition text-center shadow-sm"
        >
          Discuss Your Project 📞
        </Link>
        <Link
          href={`${process.env.NEXT_PUBLIC_PORTFOLIO_URL || '#'}`}
          target="_blank"
          className="inline-block border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition text-center"
        >
          Visit Surafel&apos;s Portfolio 🌐
        </Link>
      </div>
    </main>
  );
}