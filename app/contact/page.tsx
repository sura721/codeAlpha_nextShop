// app/contact/page.tsx

import Link from "next/link";
import { Phone, Mail, Instagram, MessageSquare, Linkedin } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-8 space-y-6 text-center">
      <h1 className="text-2xl font-bold">Contact pingShop 📞</h1>
      <p className="text-gray-600">
        Have questions about your order, products, or need help?
        <br />
        Reach out to us anytime using the options below.
      </p>

      <div className="space-y-4 text-left">
        <div className="flex items-center gap-3">
          <Phone className="text-indigo-600" />
          <span className="text-gray-800">{process.env.PHONE}</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="text-indigo-600" />
          <span className="text-gray-800"> {process.env.EMAIL}  </span>
        </div>

        <Link
          href={`https://t.me/${process.env.TELEGRAM}`}
          target="_blank"
          className="flex items-center gap-3 hover:text-indigo-600 transition"
        >
          <MessageSquare />
          <span>Message us on Telegram</span>
        </Link>
<Link
          href={`${process.env.LINKEDIN}`}
          target="_blank"
          className="flex items-center gap-3 hover:text-indigo-600 transition"
        >
          <Linkedin />
          <span>Contact us on LinkedIn</span>
        </Link>


        <Link
          href="https://wa.me/+251902663698"
          target="_blank"
          className="flex items-center gap-3 hover:text-green-600 transition"
        >
          <MessageSquare />
          <span>Chat on WhatsApp</span>
        </Link>

        <Link
          href="https://instagram.com/etern7_21"
          target="_blank"
          className="flex items-center gap-3 hover:text-pink-600 transition"
        >
          <Instagram />
          <span>DM us on Instagram</span>
        </Link>
      </div>

      <p className="text-sm text-gray-500 pt-4">
        We typically respond within 1–4 hours during business days.
      </p>
    </main>
  );
}
