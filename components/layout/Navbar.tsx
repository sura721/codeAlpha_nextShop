'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Search, User, Heart, ShoppingCart, ChevronDown } from 'lucide-react';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Contact', href: '/contact' },
];

const categories = [
    { name: 'Electronics', href: '/categories/electronics' },
    { name: 'Fashion', href: '/categories/fashion' },
    { name: 'Home Goods', href: '/categories/home-goods' },
    { name: 'Books', href: '/categories/books' },
];

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-1.3xl font-bold text-gray-900">
                            nextShop
                        </Link>
                    </div>

                    <nav className="hidden lg:flex lg:items-center lg:space-x-8">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium">
                                {link.name}
                            </Link>
                        ))}
                        <div className="relative group">
                            <button className="flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-300 font-medium">
                                Shop <ChevronDown className="ml-1 h-5 w-5" />
                            </button>
                            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
                                {categories.map((category) => (
                                    <Link key={category.name} href={category.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-500">
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                            <div className="relative">
                                <input type="text" placeholder="Search products..." className="w-full md:w-64 pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300" />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500">
                                    <Search className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href="/account" className="text-gray-600 hover:text-orange-500">
                                <User className="h-6 w-6" />
                            </Link>
                            <Link href="/wishlist" className="text-gray-600 hover:text-orange-500">
                                <Heart className="h-6 w-6" />
                            </Link>
                            <Link href="/cart" className="relative text-gray-600 hover:text-orange-500">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-orange-500 text-white text-xs font-bold rounded-full">
                                    3
                                </span>
                            </Link>
                        </div>
                        
                        <div className="lg:hidden">
                            <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-orange-500 focus:outline-none">
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <div className="relative mt-4 mb-4">
                            <input type="text" placeholder="Search products..." className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400" />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                <Search className="h-5 w-5" />
                            </button>
                        </div>
                        
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50">
                                {link.name}
                            </Link>
                        ))}
                        <div>
                            <p className="px-3 pt-4 pb-2 text-base font-medium text-gray-900">Shop By Category</p>
                            <div className="pl-3 space-y-1">
                                {categories.map((category) => (
                                    <Link key={category.name} href={category.href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-orange-500 hover:bg-gray-50">
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;