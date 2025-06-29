// app/checkout/page.tsx
import { getCart } from '@/lib/actions/cart.actions'
import { redirect } from 'next/navigation'
import CheckoutClientForm from '@/components/CheckoutClientForm'

export default async function CheckoutPage() {
  // Fetch the cart data on the server for a fast initial load
  const cart = await getCart()

  // If the cart is empty, there's nothing to check out. Redirect them.
  if (!cart || cart.items.length === 0) {
    redirect('/cart')
  }

  // Pass the server-fetched cart to the interactive client component
  return (
    <main>
      <CheckoutClientForm cart={cart} />
    </main>
  )
}