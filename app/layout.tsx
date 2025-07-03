 
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import ProgressBarProvider from "@/components/ui/ProgressBarProvider";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/contexts/cart-context";
import AIHelper from "@/components/layout/AIHelper";

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
          <CartProvider>
            <Navbar/>
            <ProgressBarProvider>
              {children}
              <AIHelper/>
            </ProgressBarProvider>
          </CartProvider>
          <Toaster position="top-right"/>
        </body>
      </html>
    </ClerkProvider>
  );
}