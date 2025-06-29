import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/utils/auth";
import slugify from "slugify";
import { writeFile } from "fs/promises";
import path from "path";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";

async function createUniqueSlug(title: string): Promise<string> {
  let slug = slugify(title, { lower: true, strict: true });
  let isUnique = false;
  let counter = 1;
  while (!isUnique) {
    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (!existingProduct) {
      isUnique = true;
    } else {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
      counter++;
    }
  }
  return slug;
}

export async function POST(req: NextRequest) {
  if (!isAdmin()) {
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const offerPrice = formData.get("offerPrice") as string | null;
    const inStock = formData.get("inStock") as string;
    const categoryId = formData.get("categoryId") as string;
    const images = formData.getAll("images") as File[];

    if (!title || !description || !price || !inStock || !categoryId || images.length === 0) {
      return NextResponse.json({ msg: "Missing required fields or images." }, { status: 400 });
    }

    const imageUrls: string[] = [];

    for (const image of images) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const imageName = `${Date.now()}-${slugify(image.name, { lower: true })}`;
      const filePath = path.join(process.cwd(), "public/uploads", imageName);
      
      await writeFile(filePath, buffer);
      
      const imageUrl = `/uploads/${imageName}`;
      imageUrls.push(imageUrl);
    }

    const priceFloat = parseFloat(price);
    const offerPriceFloat = offerPrice ? parseFloat(offerPrice) : null;
    const inStockInt = parseInt(inStock, 10);
    const slug = await createUniqueSlug(title);

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: priceFloat,
        offerPrice: offerPriceFloat,
        images: imageUrls,
        inStock: inStockInt,
        categoryId,
      },
    });

    return NextResponse.json({ msg: "Product created successfully", product }, { status: 201 });
  } catch (error: unknown) {
    console.error("API Error: /api/add/product", error);
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ msg: "A product with this title already exists." }, { status: 409 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ msg: "Server error", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ msg: "An unknown error occurred." }, { status: 500 });
  }
}