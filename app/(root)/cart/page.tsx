import { getMyCart } from '@/lib/actions/cart.action'
import CartTable from './cart-table'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your Cart'
}

const CartPage = async () => {
  const cart = await getMyCart()

  return (
    <div>
      <CartTable cart={cart} />
    </div>
  )
}

export default CartPage
