'use client'
import { Button } from '@/components/ui/button'
import { addItemToCart } from '@/lib/actions/cart.action'
import { CartItem } from '@/types'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter()
  const handleAddToCart = async () => {
    const res = await addItemToCart(item)

    if (!res.success) {
      toast.error(res.message)
      return
    }
    // handle success
    toast(res.message, {
      description: `${item.name} added to cart`,
      action: {
        label: 'Go to Cart',
        onClick: () => router.push('/cart')
      }
    })
  }
  return (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
      <Plus />
      Add to Cart
    </Button>
  )
}

export default AddToCart
