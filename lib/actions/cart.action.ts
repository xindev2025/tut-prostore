'use server'

import { CartItem } from '@/types'
import { convertToPlainObject, formatError } from '../utils'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { CartItemSchema } from '../validators'

export async function addItemToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart session not found')

    const session = await auth()
    const userId = session?.user?.id ?? undefined

    const cart = await getMyCart()

    const item = CartItemSchema.parse(data)

    const product = await prisma.product.findFirst({
      where: { id: item.productId }
    })
    console.log({
      'cart id': sessionCartId,
      'user id': userId,
      'item selected': item,
      product: product
    })
    return {
      success: true,
      message: 'Item added to cart'
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}

export async function getMyCart() {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart session not found')

    const session = await auth()
    const userId = session?.user?.id ?? undefined

    const cart = await prisma.cart.findFirst({
      where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
    })

    if (!cart) return undefined

    return convertToPlainObject({
      ...cart,
      items: cart.items as CartItem[],
      itemsPrice: cart.itemsPrice.toString(),
      totalPrice: cart.totalPrice.toString(),
      shippingPrice: cart.shippingPrice.toString(),
      taxPrice: cart.taxPrice.toString()
    })
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}
