'use client';

import { useState } from 'react';
import Link from "next/link";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Loader, ShoppingCart, SearchIcon, Menu, X } from "lucide-react";

type NavbarProps = {
  isAdmin: boolean;
};

export default function NavbarClient({ isAdmin }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
   { href: "/order", label: "my orders" },




    
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex-shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="text-xl font-bold text-white px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-transform hover:scale-105">
                nextShop
              </span>
            </Link>
            {/* The desktop links are rendered from the navLinks array */}
            <div className="hidden sm:flex sm:items-center sm:space-x-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-slate-600 hover:text-purple-600 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

       
        </div>

        {/* The mobile dropdown also renders from the same navLinks array */}
        {isMobileMenuOpen && (
          <div className="sm:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md border-b border-t border-slate-200 shadow-lg">
            <div className="flex flex-col px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-base font-medium text-slate-700 hover:bg-slate-100 block px-3 py-2 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-slate-200" />
               <SignedIn>
                  <Link href="/cart" className="text-base font-medium text-slate-700 hover:bg-slate-100  px-3 py-2 rounded-md flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    My Cart
                  </Link>
                   <div className="px-3 py-2">
                     <UserButton afterSignOutUrl="/" showName />
                  </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full text-left text-base font-medium text-slate-700 hover:bg-slate-100 block px-3 py-2 rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}