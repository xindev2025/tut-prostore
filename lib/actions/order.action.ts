'use server'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { formatError } from '../utils'
import { auth } from '@/auth'
import { getMyCart } from './cart.action'
import { getUserById } from './user.actions'
import { InsertOrderSchema } from '../validators'
import { prisma } from '@/db/prisma'

export async function createOrder() {
  try {
    const session = await auth()
    if (!session) {
      throw new Error('User is not authenticated')
    }
    const userId = session.user?.id
    if (!userId) {
      throw new Error('User not found')
    }

    const user = await getUserById(userId)

    const cart = await getMyCart()
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty',
        redirectTo: '/cart'
      }
    }

    if (!user.address) {
      return {
        success: false,
        message: 'No shipping address is empty',
        redirectTo: '/shipping-address'
      }
    }
    if (!user.paymentMethod) {
      return {
        success: false,
        message: 'No payment method',
        redirectTo: '/payment-method'
      }
    }

    // create order object
    const order = InsertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice
    })

    // create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // create order
      const insertedOrder = await tx.order.create({ data: order })

      // create order items from the cart items
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id
          }
        })
      }

      // clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0
        }
      })

      return insertedOrder.id
    })

    if (!insertedOrderId) {
      throw new Error('Order not created')
    }

    return {
      success: true,
      message: 'Order created',
      redirectTo: `/order/${insertedOrderId}`
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: formatError(error) }
  }
}
