// components/layout/Footer.tsx

import Link from 'next/link';
import { Instagram, Linkedin, MessageSquare, Phone } from 'lucide-react';

const socialLinks = [
  {
    name: 'LinkedIn',
    href: `${process.env.LINKEDIN || '#'}`,
    icon: Linkedin,
  },
  {
    name: 'Telegram',
    href: `https://t.me/${process.env.TELEGRAM || ''}`,
    icon: MessageSquare,
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/etern7_21',
    icon: Instagram,
  },
  {
    name: 'Phone',
    href: `tel:${process.env.PHONE || ''}`,
    icon: Phone,
  },
];

const navigation = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'Featured', href: '/products?category=featured' }, 
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Shipping Policy', href: '/shipping' }, 
    { name: 'Returns Policy', href: '/returns' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex-shrink-0">
              <span>
                ping<span className="text-yellow-300">Shop</span>
              </span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Curated modern apparel, electronics, and unique gadgets for a sophisticated lifestyle.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Shop</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.shop.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Company</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">Legal</h3>
                <ul role="list" className="mt-4 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-base text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-base text-gray-400 dark:text-gray-500 xl:text-center">
            © {new Date().getFullYear()} pingShop. All rights reserved. Developed by Surafel Admas.
          </p>
        </div>
      </div>
    </footer>
  );
}