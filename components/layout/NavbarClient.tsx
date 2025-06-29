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

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full sm:w-40 md:w-56 pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <ClerkLoading>
              <Loader className="h-7 w-7 animate-spin text-slate-400" />
            </ClerkLoading>

            <ClerkLoaded>
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/cart" className="p-2 text-slate-600 hover:text-purple-600 rounded-full hover:bg-slate-100">
                   <ShoppingCart className="h-6 w-6" />
                </Link>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-9 w-9" } }} />
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>

              <div className="sm:hidden flex items-center">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-slate-600 hover:bg-slate-100">
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </ClerkLoaded>
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