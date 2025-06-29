import ProductDetailClient from "@/components/products/product-detail-client"
import { getProductBySlug } from "@/lib/actions/product.actions"

import { notFound } from "next/navigation"

type ProductDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } =await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}