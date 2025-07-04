// components/ProductSchema.tsx

import { ProductWithDetails } from "@/lib/types"; // Make sure this import path is correct

type Props = {
  product: ProductWithDetails;
}

export const ProductSchema = ({ product }: Props) => {
  const siteUrl = 'https://ping-shop.vercel.app';
  const primaryVariant = product.variants.find(v => v.inStock > 0) || product.variants[0];
  
  const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
  const avgRating = product.reviews.length > 0 ? (totalRating / product.reviews.length).toFixed(2) : undefined;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: primaryVariant?.image,
    description: product.description.substring(0, 5000),
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Ping Shop',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product/${product.slug}`,
      priceCurrency: 'USD',
      price: (primaryVariant?.offerPrice ?? primaryVariant?.price).toFixed(2),
      availability: primaryVariant?.inStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: avgRating ? {
      '@type': 'AggregateRating',
      ratingValue: avgRating,
      reviewCount: product.reviews.length.toString(),
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};