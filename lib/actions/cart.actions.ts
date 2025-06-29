
import prisma from "../prisma"

async function findOrCreateCart(userId: string) {
  let userCart = await prisma.order.findFirst({
    where: {
      userId: userId,
      status: "PENDING",
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  })

  if (!userCart) {
    userCart = await prisma.order.create({
      data: {
        userId: userId,
        status: "PENDING",
        total: 0,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    })
  }
  return userCart
}

async function calculateCartTotals(cartId: string) {
  const cart = await prisma.order.findUnique({
    where: { id: cartId },
    include: { items: true },
  })

  if (!cart) {
    throw new Error("Cart not found")
  }

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const grandTotal = total + (cart.shippingCost || 0)

  return prisma.order.update({
    where: { id: cartId },
    data: {
      total,
      grandTotal,
    },
  })
}

export async function getCartByUserId(userId: string) {
  const cart = await findOrCreateCart(userId)
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    id: cart.id,
    items: cart.items.map((item) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    })),
    total: cart.total,
    itemCount,
    shippingMethod: cart.shippingMethod,
    shippingCost: cart.shippingCost,
    grandTotal: cart.total + (cart.shippingCost || 0),
  }
}

export async function addItemToCart(userId: string, productId: string, quantity: number) {
  const cart = await findOrCreateCart(userId)

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) throw new Error("Product not found")

  const existingItem = await prisma.orderItem.findFirst({
    where: {
      orderId: cart.id,
      productId: productId,
    },
  })

  if (existingItem) {
    await prisma.orderItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: quantity } },
    })
  } else {
    await prisma.orderItem.create({
      data: {
        orderId: cart.id,
        productId: productId,
        quantity: quantity,
        price: product.offerPrice || product.price,
      },
    })
  }

  await calculateCartTotals(cart.id)
  return getCartByUserId(userId)
}

export async function updateItemQuantityInCart(userId: string, productId: string, quantity: number) {
  const cart = await findOrCreateCart(userId)

  if (quantity <= 0) {
    await prisma.orderItem.deleteMany({
      where: {
        orderId: cart.id,
        productId: productId,
      },
    })
  } else {
    await prisma.orderItem.updateMany({
      where: {
        orderId: cart.id,
        productId: productId,
      },
      data: { quantity: quantity },
    })
  }

  await calculateCartTotals(cart.id)
  return getCartByUserId(userId)
}

export async function removeItemFromCart(userId: string, productId: string) {
  const cart = await findOrCreateCart(userId)

  await prisma.orderItem.deleteMany({
    where: {
      orderId: cart.id,
      productId: productId,
    },
  })

  await calculateCartTotals(cart.id)
  return getCartByUserId(userId)
}

export async function clearUserCart(userId: string) {
  const cart = await findOrCreateCart(userId)

  await prisma.orderItem.deleteMany({ where: { orderId: cart.id } })
  await calculateCartTotals(cart.id)
  return getCartByUserId(userId)
}

export async function setShippingForCart(userId: string, shippingMethod: string, shippingCost: number) {
  const cart = await findOrCreateCart(userId)

  await prisma.order.update({
    where: { id: cart.id },
    data: {
      shippingMethod,
      shippingCost,
    },
  })
  
  await calculateCartTotals(cart.id)
  return getCartByUserId(userId)
}