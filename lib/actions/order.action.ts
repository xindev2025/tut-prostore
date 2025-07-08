'use server'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { convertToPlainObject, formatError } from '../utils'
import { auth } from '@/auth'
import { getMyCart } from './cart.action'
import { getUserById } from './user.actions'
import { InsertOrderSchema } from '../validators'
import { prisma } from '@/db/prisma'
import { paypal } from '../paypal'
import { PaymentResult } from '@/types'
import { revalidatePath } from 'next/cache'
import { PAGE_SIZE } from '../constants'
import { Prisma } from '../generated/prisma'

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

// get order by id
export async function getOrderById(orderId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItem: true,
      user: { select: { name: true, email: true } }
    }
  })

  return convertToPlainObject(order)
}

// create new paypal order
export async function createPaypalOrder(orderId: string) {
  try {
    // get order from data
    const order = await prisma.order.findFirst({
      where: { id: orderId }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    // create paypal order
    const paypalOrder = await paypal.createOrder(Number(order.totalPrice))

    // update order with paypal order id
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          emailAddress: '',
          status: '',
          pricePaid: 0
        }
      }
    })

    return {
      success: true,
      message: 'Item order created successfully',
      data: paypalOrder.id
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: formatError(error) }
  }
}

// approve paypal order and update order to paid
export async function approvePaypalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    // get order from database
    const order = await prisma.order.findFirst({
      where: { id: orderId }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    const captureData = await paypal.capturePayment(data.orderID)

    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in paypal payment')
    }

    // update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        emailAddress: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value
      }
    })

    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: 'Your order has been paid'
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: formatError(error) }
  }
}

// update order to paid
async function updateOrderToPaid({
  orderId,
  paymentResult
}: {
  orderId: string
  paymentResult?: PaymentResult
}) {
  // get order from database
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItem: true
    }
  })

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.isPaid) {
    throw new Error('Order is already paid')
  }

  // transaction to update order and account for product stock
  await prisma.$transaction(async (tx) => {
    // iterate over products and update stock
    for (const item of order.orderItem) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: -item.qty }
        }
      })
    }

    // set order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult
      }
    })
  })

  // get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItem: true,
      user: { select: { name: true, email: true } }
    }
  })

  if (!updatedOrder) {
    throw new Error('Order not found')
  }
}

// get user orders
export async function getUserOrders({
  limit = PAGE_SIZE,
  page
}: {
  limit?: number
  page: number
}) {
  const session = await auth()
  if (!session) {
    throw new Error('User is not authorized')
  }

  const data = await prisma.order.findMany({
    where: { userId: session.user?.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit
  })

  const dataCount = await prisma.order.count({
    where: { userId: session.user?.id }
  })

  return {
    data,
    totalPages: Math.ceil(dataCount / limit)
  }
}

type SalesDataType = {
  month: string
  totalSales: number
}[]

// get sales data and order summary
export async function getOrderSummary() {
  // get count for each resource
  const ordersCount = await prisma.order.count()
  const productsCount = await prisma.product.count()
  const usersCount = await prisma.user.count()

  // calculate total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true }
  })

  // get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`
    Select to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" 
    GROUP BY to_char("createdAt", 'MM/YY')
  `

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales)
  }))

  // get latest sales
  const latestSales = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } }
    },
    take: 6
  })

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestSales,
    salesData
  }
}
