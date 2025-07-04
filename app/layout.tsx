import type { Metadata } from 'next'
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import ProgressBarProvider from "@/components/ui/ProgressBarProvider";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/cart-context";
import AIHelper from "@/components/layout/AIHelper";
import { ThemeProvider } from '../components/theme-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Ping Shop - Modern Apparel & Electronics',
    template: '%s | Ping Shop',
  },
  description: "Discover the latest in modern apparel, electronics, and unique gadgets at Ping Shop. Quality products with fast, reliable shipping.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CartProvider>
              <Navbar />
              <ProgressBarProvider>
                {children}
                <AIHelper />
              </ProgressBarProvider>
            </CartProvider>
            <Toaster position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}