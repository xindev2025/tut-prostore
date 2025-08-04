import { getOrderById } from '@/lib/actions/order.action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import OrderDetailsTable from './order-details-table'
import { ShippingAddress } from '@/types'
import { auth } from '@/auth'
import Stripe from 'stripe'

export const metadata: Metadata = {
  title: 'Order Page Details'
}

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await props.params

  const order = await getOrderById(id)
  if (!order) {
    notFound()
  }

  const session = await auth()

  // check if is not paid and using stripe
  let client_secret = null
  if (order.paymentMethod === 'stripe' && !order.isPaid) {
    // init stripe instance
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id }
    })

    client_secret = paymentIntent.client_secret
  }

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress
      }}
      stripeClientSecret={client_secret}
      paypalClientId={process.env.PAYPAL_CLIENT_ID ?? 'sb'}
      isAdmin={session?.user.role === 'admin'}
    />
  )
}

export default OrderDetailsPage
