// components/HeroSection.tsx

'use client'; // This must be a client component for the autoplay plugin to work

import Image from 'next/image';
import Link from 'next/link';
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Define the shape of the data this component expects
export type HeroProduct = {
  href: string;
  src: string;
  alt: string;
  title: string;
  description: string;
};

type HeroSectionProps = {
  featuredProducts: HeroProduct[];
};

export function HeroSection({ featuredProducts }: HeroSectionProps) {
  if (!featuredProducts || featuredProducts.length === 0) {
    // Don't render the component if there's no data
    return null;
  }

  return (
    <div className="w-full mb-8 lg:mb-12">
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: true,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {featuredProducts.map((product, index) => (
            <CarouselItem key={index}>
              <Link href={product.href}>
                <Card className="border-none overflow-hidden">
                  <CardContent className="relative flex aspect-[16/7] items-center justify-center p-0">
                    <Image
                      src={product.src}
                      alt={product.alt}
                      fill
                      priority={index === 0} // Prioritize loading the first image
                      className="object-cover rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent rounded-lg" />
                    <div className="relative text-white p-8 md:p-12 self-end w-full">
                      <h1 className="text-3xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
                        {product.title}
                      </h1>
                      <p className="mt-2 text-md md:text-lg max-w-2xl truncate drop-shadow-md">
                        {product.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Hide controls if only one item */}
        {featuredProducts.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex" />
          </>
        )}
      </Carousel>
    </div>
  );
}