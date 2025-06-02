import { auth } from '@/auth'
import { getMyCart } from '@/lib/actions/cart.action'
import { getUserById } from '@/lib/actions/user.actions'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Shipping Address'
}

const ShippingAddressPage = async () => {
  // get cart
  const cart = await getMyCart()
  // check cart
  if (!cart || cart.items.length === 0) redirect('/cart')
  // get session
  const session = await auth()

  // get user
  const userId = session?.user?.id
  // check user
  if (!userId) throw new Error('User not found')

  const user = await getUserById(userId)

  return <>Address</>
}

export default ShippingAddressPage
