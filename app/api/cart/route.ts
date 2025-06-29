import { NextResponse } from "next/server"
import {
  getCartByUserId,
  addItemToCart,
  updateItemQuantityInCart,
  removeItemFromCart,
  clearUserCart,
  setShippingForCart
} from "@/lib/actions/cart.actions"


async function getUserIdFromSession() {
  // This is a placeholder.
  // Replace this with your actual session management logic (e.g., from Clerk, Next-Auth).
  // For demonstration, we'll use a hardcoded user ID.
  // In a real app, you MUST get this from a secure session.
  // const { userId } = auth();
  // if (!userId) return null;
  // return userId;
  return "clerk_user_id_placeholder" // IMPORTANT: Replace this.
}

export async function GET() {
  try {
    const userId = await getUserIdFromSession()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const cart = await getCartByUserId(userId)
    return NextResponse.json(cart)
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while fetching the cart." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromSession()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { productId, quantity } = await request.json()
    if (!productId || typeof quantity !== "number") {
      return NextResponse.json({ error: "Product ID and quantity are required." }, { status: 400 })
    }
    const updatedCart = await addItemToCart(userId, productId, quantity)
    return NextResponse.json(updatedCart)
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while adding the item." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  try {
    const userId = await getUserIdFromSession()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    if (action === "update_quantity") {
      const { productId, quantity } = await request.json()
       if (!productId || typeof quantity !== "number") {
        return NextResponse.json({ error: "Product ID and quantity are required." }, { status: 400 })
      }
      const updatedCart = await updateItemQuantityInCart(userId, productId, quantity)
      return NextResponse.json(updatedCart)
    }

    if(action === "set_shipping") {
        const { shippingMethod, shippingCost } = await request.json()
        if (!shippingMethod || typeof shippingCost !== "number") {
            return NextResponse.json({ error: "Shipping method and cost are required." }, { status: 400 })
        }
        const updatedCart = await setShippingForCart(userId, shippingMethod, shippingCost)
        return NextResponse.json(updatedCart)
    }
    
    return NextResponse.json({ error: "Invalid action." }, { status: 400 })

  } catch (error) {
    return NextResponse.json({ error: "An error occurred during the update." }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")

  try {
    const userId = await getUserIdFromSession()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (productId) {
      const updatedCart = await removeItemFromCart(userId, productId)
      return NextResponse.json(updatedCart)
    } else {
      const clearedCart = await clearUserCart(userId)
      return NextResponse.json(clearedCart)
    }
  } catch (error) {
    return NextResponse.json({ error: "An error occurred while deleting." }, { status: 500 })
  }
}