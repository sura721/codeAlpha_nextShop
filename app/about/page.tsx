// app/about/page.tsx

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-center tracking-tight">
        About NextStore 🛍️
      </h1>

      <p className="text-gray-700 leading-relaxed text-center text-lg">
        Welcome to <span className="font-semibold">NextStore</span> — your trusted online electronics store in Ethiopia 🇪🇹.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg">
        At NextStore, we help you find quality electronics easily and affordably, from smartwatches and headphones to the latest gadgets that make your life easier. Our goal is to make online shopping simple, reliable, and enjoyable for everyone. 🛒✨
      </p>

      <div className="space-y-2">
        <p className="text-gray-700 leading-relaxed text-lg">
          Why customers love NextStore:
        </p>
        <ul className="list-disc list-inside text-gray-700 text-lg space-y-1">
          <li>🚚 Fast delivery within 2–5 days across Ethiopia</li>
          <li>🤝 7-day return policy for defective or incorrect products</li>
          <li>💬 Friendly, responsive customer support</li>
        </ul>
      </div>

      <p className="text-gray-700 leading-relaxed text-lg">
        NextStore is proudly owned by <span className="font-semibold">Surafel Admas</span>, a full-stack web engineer dedicated to building reliable online services for  customers.
      </p>

      <p className="text-gray-700 leading-relaxed text-lg">
        Have a question about your order or need product recommendations? We&apos;d love to help!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/contact"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-indigo-700 transition text-center"
        >
          Contact Us 📞
        </Link>

        <Link
          href="https://surafels-portfolio.vercel.app/"
          target="_blank"
          className="inline-block border border-indigo-600 text-indigo-600 px-6 py-3 rounded-full text-base font-semibold hover:bg-indigo-50 transition text-center"
        >
          Visit Surafel&apos;s Portfolio 🌐
        </Link>
      </div>
    </main>
  );
}
