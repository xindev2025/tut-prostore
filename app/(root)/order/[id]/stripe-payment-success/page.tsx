export const runtime = 'nodejs'
import Stripe from 'stripe'
import { getOrderById } from '@/lib/actions/order.action'
import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const SuccessPage = async (props: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ payment_intent: string }>
}) => {
  const { id } = await props.params
  const { payment_intent } = await props.searchParams

  const order = await getOrderById(id)
  if (!order) notFound()

  // retrieve payment intent
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)

  // check payment intent valid
  if (
    paymentIntent.metadata.orderId == null ||
    paymentIntent.metadata.orderId !== order.id.toString()
  ) {
    return notFound()
  }

  // check if payment success
  const isSuccess = paymentIntent.status === 'succeeded'

  if (!isSuccess) return redirect(`/order/${id}`)

  return (
    <div className='max-w-4xl w-full mx-auto space-y-8'>
      <div className='flex flex-col gap-6 items-center'>
        <h1 className='h1-bold'>Thanks for your purchase</h1>
        <div>We are processing your order</div>
        <Button asChild>
          <Link href={`/order/${id}`}>View Order</Link>
        </Button>
      </div>
    </div>
  )
}

export default SuccessPage
