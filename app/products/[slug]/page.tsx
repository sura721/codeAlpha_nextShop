import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/actions/product.actions";
import ProductDetailClient from '@/components/products/product-detail-client';
import { ProductSchema } from '@/components/ProductSchema';

type ProductDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}




export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const {slug} =await params
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const siteUrl = 'https://ping-shop.vercel.app';
  
  const pageTitle = `${product.title} | ${product.category.name} | Ping Shop`;
  
  const pageDescription = product.description.substring(0, 155).replace(/\n/g, ' ');

  const primaryImage = product.variants[0]?.image || `${siteUrl}/placeholder.svg`;

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `${siteUrl}/product/${product.slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${siteUrl}/product/${product.slug}`,
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 800,
          alt: `Image of ${product.title}`,
        },
      ],
      type: 'website',
      siteName: 'Ping Shop',
    },
  };
}


export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } =await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <>
   <ProductSchema product={product} />
  <ProductDetailClient product={product} /> 
  </>
 
}


