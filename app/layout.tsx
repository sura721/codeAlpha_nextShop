// FILE: app/layout.tsx

import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import ProgressBarProvider from "@/components/ui/ProgressBarProvider";
import Navbar from "@/components/layout/Navbar";

import { CartProvider } from "@/contexts/cart-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "nextShop",
  description: "Your modern e-commerce solution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {/* 2. WRAP THE COMPONENTS THAT NEED THE CART */}
          <CartProvider>
            <Navbar/>
            <ProgressBarProvider>
              {children}
            </ProgressBarProvider>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}