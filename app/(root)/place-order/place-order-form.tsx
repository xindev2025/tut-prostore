'use client'

import { Button } from '@/components/ui/button'
import { createOrder } from '@/lib/actions/order.action'
import { Check, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

const PlaceOrderForm = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    startTransition(async () => {
      const res = await createOrder()

      if (res.redirectTo) {
        router.push(res.redirectTo)
      }
    })
  }

  return (
    <form className='w-full' onSubmit={handleSubmit}>
      <Button disabled={isPending} className='w-full'>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Check className='w-4 h-4' />
        )}{' '}
        Place Order
      </Button>
    </form>
  )
}

export default PlaceOrderForm
