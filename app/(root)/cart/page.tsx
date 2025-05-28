import { getMyCart } from '@/lib/actions/cart.action'
import CartTable from './cart-table'

const CartPage = async () => {
  const cart = await getMyCart()

  return (
    <div>
      <CartTable cart={cart} />
    </div>
  )
}

export default CartPage
