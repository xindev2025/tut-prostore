'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action'
import { formatCurrency } from '@/lib/utils'
import { Cart, CartItem } from '@/types'
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [removeItemState, setRemoveItemState] = useState<string | null>(null)
  const [addItemState, setAddItemState] = useState<string | null>(null)

  const handleRemoveItem = async (productId: string) => {
    setRemoveItemState(productId)
    startTransition(async () => {
      const res = await removeItemFromCart(productId)

      toast('Your Cart', {
        description: res.message
      })

      setRemoveItemState(null)
    })
  }

  const handleAddItem = async (item: CartItem) => {
    setAddItemState(item.productId)
    startTransition(async () => {
      const res = await addItemToCart(item)

      toast('Your Cart', {
        description: res.message
      })
      setAddItemState(null)
    })
  }

  const handleCheckout = async () => {
    startTransition(async () => router.push('/shipping-address'))
  }

  return (
    <>
      <h1 className='py-4 h2-bold'>Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is Empty. <Link href='/'>Go Shopping</Link>{' '}
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className='text-center'>Quantity</TableHead>
                  <TableHead className='text-right'>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.slug}>
                    <TableCell>
                      <Link
                        className='flex items-center'
                        href={`/products/${item.slug}`}
                      >
                        <Image
                          src={item.image}
                          alt={item.slug}
                          width={50}
                          height={50}
                        />
                        <span className='px-2'>{item.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className='flex-center gap-3'>
                      <Button
                        disabled={removeItemState === item.productId}
                        type='button'
                        variant='outline'
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        {removeItemState === item.productId ? (
                          <Loader className='h-4 w-4 animate-spin' />
                        ) : (
                          <Minus className='h-4 w-4'></Minus>
                        )}
                      </Button>
                      <span>{item.qty}</span>
                      <Button
                        disabled={addItemState === item.productId}
                        type='button'
                        variant='outline'
                        onClick={() => handleAddItem(item)}
                      >
                        {addItemState === item.productId ? (
                          <Loader className='h-4 w-4 animate-spin' />
                        ) : (
                          <Plus className='h-4 w-4'></Plus>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className='text-right'>${item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className='p-4 gap-4'>
              <div className='pb-3 text-xl'>
                Subtotal ({cart.items.reduce((a, c) => a + c.qty, 0)})
                <span className='font-bold'>
                  {formatCurrency(cart.itemsPrice)}
                </span>
              </div>
              <Button
                disabled={isPending}
                onClick={handleCheckout}
                className='w-full'
              >
                {isPending ? (
                  <Loader className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowRight className='w-4 h-4' />
                )}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default CartTable
