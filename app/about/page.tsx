// app/about/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'About Ping Shop',
  description: 'Learn about Ping Shop, our mission to provide high-quality modern products, and why customers trust us. Founded by full-stack engineer Surafel Admas.',
};

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center tracking-tight text-gray-900">
        About Ping Shop 🛍️
      </h1>

      <p className="text-gray-700 leading-relaxed text-center text-lg">
        Welcome to <span className="font-semibold text-gray-900">Ping Shop</span> — your destination for curated modern apparel, electronics, and unique gadgets.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg">
        At Ping Shop, we believe finding high-quality, innovative products should be simple and exciting. We carefully select every item in our collection to ensure it meets our high standards of quality, design, and functionality. Our goal is to make online shopping reliable and enjoyable for everyone. 🛒✨
      </p>

      <div className="space-y-3 p-6 bg-slate-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">
          Why Choose Ping Shop?
        </h2>
        <ul className="list-disc list-inside text-gray-700 text-lg space-y-1">
          <li>🚚 Fast and reliable delivery</li>
          <li>✅ A straightforward return policy for your peace of mind</li>
          <li>💬 Friendly and responsive customer support ready to help</li>
        </ul>
      </div>

      <p className="text-gray-700 leading-relaxed text-lg">
        Ping Shop is proudly owned by <span className="font-semibold text-gray-900">Surafel Admas</span>, a full-stack engineer dedicated to building reliable and user-friendly online experiences.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg">
        Have a question about your order or need a recommendation? We&apos;d love to help!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Link
          href="/contact"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg text-base font-semibold hover:bg-indigo-700 transition text-center shadow-sm"
        >
          Contact Us 📞
        </Link>
        <Link
          href={`${process.env.NEXT_PUBLIC_PORTFOLIO_URL || '#'}`} // Recommended to use NEXT_PUBLIC_ for env vars
          target="_blank"
          className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-base font-semibold hover:bg-gray-100 transition text-center"
        >
          Visit Surafel&apos;s Portfolio 🌐
        </Link>
      </div>
    </main>
  );
}