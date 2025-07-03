import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkIsAdmin } from "@/lib/actions/user.actions";
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
    const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
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

    const firstImage = images[0];
    const bytes = await firstImage.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageName = `${Date.now()}-${slugify(firstImage.name, { lower: true })}`;
    const filePath = path.join(process.cwd(), "public/uploads", imageName);
    
    await writeFile(filePath, buffer);
    
    const imageUrl = `/uploads/${imageName}`;

    const priceFloat = parseFloat(price);
    const offerPriceFloat = offerPrice ? parseFloat(offerPrice) : null;
    const inStockInt = parseInt(inStock, 10);
    const slug = await createUniqueSlug(title);
    const sku = `${slug}-default`;

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        categoryId,
        variants: {
          create: {
            name: "Default",
            price: priceFloat,
            offerPrice: offerPriceFloat,
            image: imageUrl,
            inStock: inStockInt,
            sku: sku,
          },
        },
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json({ msg: "Product created successfully", product }, { status: 201 });
  } catch (error: unknown) {
     if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ msg: "A product with this title or variant SKU already exists." }, { status: 409 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ msg: "Server error", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ msg: "An unknown error occurred." }, { status: 500 });
  }
}