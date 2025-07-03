 
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
     return new NextResponse(
      JSON.stringify({ msg: "Failed to fetch categories." }),
      { status: 500 }
    );
  }
}

 function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") 
    .replace(/[\s_-]+/g, "-")  
    .replace(/^-+|-+$/g, ""); }
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

     const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: { equals: trimmedName, mode: "insensitive" } }, { slug: slug }],
      },
    });

    if (existingCategory) {
      return new NextResponse(
        JSON.stringify({ msg: "A category with this name or slug already exists." }),
        { status: 409 }  
      );
    }

     const newCategory = await prisma.category.create({
      data: {
        name: trimmedName,
        slug: slug,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });   
  } catch (error) {
     return new NextResponse(
      JSON.stringify({ msg: "Failed to create category." }),
      { status: 500 }
    );
  }
}