'use client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import { Order } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer
} from '@paypal/react-paypal-js'
import {
  approvePaypalOrder,
  createPaypalOrder,
  deliveredOrder,
  updateOrderToPaidCOD
} from '@/lib/actions/order.action'
import { toast } from 'sonner'
import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import StripePayment from './stripe-payment'

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret
}: {
  order: Omit<Order, 'paymentResult'>
  paypalClientId: string
  isAdmin: boolean
  stripeClientSecret: string | null
}) => {
  const {
    paymentMethod,
    isPaid,
    paidAt,
    shippingAddress,
    isDelivered,
    deliveredAt,
    orderItem,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice
  } = order

  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    let status = ''
    if (isPending) {
      status = 'Loading PayPal...'
    }

    if (isRejected) {
      status = 'Error loading Paypal'
    }

    return status
  }

  const handleCreatePaypalOrder = async () => {
    const res = await createPaypalOrder(order.id)
    if (!res.success) {
      toast('Paypal Error', {
        description: res.message
      })
    }
    return res.data
  }

  const handleApprovePaypalOrder = async (data: { orderID: string }) => {
    const res = await approvePaypalOrder(order.id, data)

    toast('Paypal Payment', {
      description: res.message
    })
  }

  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition()

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id)
            toast('COD payment', {
              description: res.message
            })
          })
        }
      >
        {isPending ? 'Processing...' : 'Mark as Paid'}
      </Button>
    )
  }

  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition()

    return (
      <Button
        type='button'
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await deliveredOrder(order.id)
            toast('COD payment', {
              description: res.message
            })
          })
        }
      >
        {isPending ? 'Processing...' : 'Mark as Delivered'}
      </Button>
    )
  }

  return (
    <>
      <h1 className='py-4 text-2xl'>Order {formatId(order.id)}</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='col-span-2 space-y-4 overflow-x-auto'>
          <Card className='my-2'>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Payment Method</h2>
              <p className='mb-2'>{paymentMethod}</p>
              {isPaid ? (
                <Badge variant={'secondary'}>
                  Paid at {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant={'destructive'}>Not Paid</Badge>
              )}
            </CardContent>
          </Card>
          <Card className='my-2'>
            <CardContent className='p-4 gap-4'>
              <h2 className='text-xl pb-4'>Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.streetAddress}, {shippingAddress.city}
              </p>
              <p className='mb-2'>
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              {isDelivered ? (
                <Badge variant={'secondary'}>
                  Delivered at {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant={'destructive'}>Not Delivered</Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className='gap-2 p-4'>
              <h2 className='text-xl pb-4'>Order Item</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className='text-right'>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItem.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link href={`/products/${item.slug}`}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className='px-2'>{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className='px-2'>{item.qty}</TableCell>
                      <TableCell className='text-right'>{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex justify-between'>
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className='flex justify-between'>
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {/* stripe payment */}
              {!isPaid && paymentMethod === 'stripe' && stripeClientSecret && (
                <StripePayment
                  priceInCents={Number(order.totalPrice) * 100}
                  orderId={order.id}
                  clientSecret={stripeClientSecret}
                />
              )}
              {/* paypal payment */}
              {!isPaid && paymentMethod === 'paypal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePaypalOrder}
                      onApprove={handleApprovePaypalOrder}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
              {/* COD payment */}
              {isAdmin && !isPaid && paymentMethod === 'cashOnDelivery' && (
                <MarkAsPaidButton />
              )}
              {/* Order Delivered */}
              {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default OrderDetailsTable
