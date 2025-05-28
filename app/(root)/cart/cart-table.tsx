import { Cart } from '@/types'
import Link from 'next/link'

const CartTable = ({ cart }: { cart?: Cart }) => {
  return (
    <>
      <h1 className='py-4 h2-bold'>Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is Empty. <Link href='/'>Go Shopping</Link>{' '}
        </div>
      ) : (
        <div>
          <div>Table</div>
        </div>
      )}
    </>
  )
}

export default CartTable
