// File: app/api/categories/route.ts

import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma"; 

 export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return new NextResponse(
      JSON.stringify({ msg: "Failed to fetch categories." }),
      { status: 500 }
    );
  }
}

// Function to generate a URL-friendly slug from a name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters (excluding spaces and hyphens)
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
}

// The new POST function to create a category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return new NextResponse(
        JSON.stringify({ msg: "Category name is required." }),
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const slug = createSlug(trimmedName);

    // Check if a category with the same name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: { equals: trimmedName, mode: "insensitive" } }, { slug: slug }],
      },
    });

    if (existingCategory) {
      return new NextResponse(
        JSON.stringify({ msg: "A category with this name or slug already exists." }),
        { status: 409 } // 409 Conflict status code
      );
    }

    // Create the new category
    const newCategory = await prisma.category.create({
      data: {
        name: trimmedName,
        slug: slug,
      },
    });

    return NextResponse.json(newCategory, { status: 201 }); // 201 Created status code
  } catch (error) {
    console.error("Failed to create category:", error);
    return new NextResponse(
      JSON.stringify({ msg: "Failed to create category." }),
      { status: 500 }
    );
  }
}