'use client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action'
import { Cart, CartItem } from '@/types'
import { Loader, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

const CartTable = ({ cart }: { cart?: Cart }) => {
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
        </div>
      )}
    </>
  )
}

export default CartTable
