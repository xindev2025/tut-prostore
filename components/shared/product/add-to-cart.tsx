'use client'
import { Button } from '@/components/ui/button'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action'
import { Cart, CartItem } from '@/types'
import { Loader, Minus, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

const AddToCart = ({ item, cart }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item)

      if (!res.success) {
        toast.error(res.message)
        return
      }
      // handle success
      toast('Your Cart', {
        description: res.message,
        action: {
          label: 'Go to Cart',
          onClick: () => router.push('/cart')
        }
      })
    })
  }

  const itemExist = cart?.items.find(
    (product) => product.productId === item.productId
  )

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId)

      toast('Your Cart', {
        description: res.message,
        action: {
          label: 'Go to Cart',
          onClick: () => router.push('/cart')
        }
      })
    })
  }

  return itemExist ? (
    <div>
      <Button variant='outline' type='button' onClick={handleRemoveFromCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Minus className='w-4 h-4' />
        )}
      </Button>
      <span className='px-2'>{itemExist.qty}</span>
      <Button variant='outline' type='button' onClick={handleAddToCart}>
        {isPending ? (
          <Loader className='w-4 h-4 animate-spin' />
        ) : (
          <Plus className='w-4 h-4' />
        )}
      </Button>
    </div>
  ) : (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
      {isPending ? (
        <Loader className='w-4 h-4 animate-spin' />
      ) : (
        <Minus className='w-4 h-4' />
      )}
      Add to Cart
    </Button>
  )
}

export default AddToCart
