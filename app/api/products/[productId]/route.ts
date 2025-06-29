import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path

// GET a single product for editing
export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const {productId} = await params
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ msg: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT (update) a single product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
   const { productId } = await params;
  // NOTE: This assumes you have a similar image upload handler as your create endpoint
  // A real implementation would need to handle image replacement/deletion logic carefully
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const offerPrice = formData.get('offerPrice') ? parseFloat(formData.get('offerPrice') as string) : null;
  const inStock = parseInt(formData.get('inStock') as string);
  const categoryId = formData.get('categoryId') as string;
  
  // You would need a robust way to handle image updates (e.g. which to delete, which are new)
  // For this example, we'll assume we are replacing all images if new ones are provided.
  
  try {
    const updatedProduct = await prisma.product.update({
      where: { id:productId },
      data: {
        title,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        description,
        price,
        offerPrice,
        inStock,
        categoryId,
        // Add image update logic here if new images are uploaded
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: 'Failed to update product' }, { status: 500 });
  }
}