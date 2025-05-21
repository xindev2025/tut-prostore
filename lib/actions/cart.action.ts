'use server'

import { CartItem } from '@/types'
import { convertToPlainObject, formatError, round2 } from '../utils'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { CartItemSchema, InsertCartSchema } from '../validators'
import { revalidatePath } from 'next/cache'

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = items.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0
  )
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10)
  const taxPrice = round2(0.15 * itemsPrice)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2)
  }
}

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

    if (!product) throw new Error('Product not found')

    if (!cart) {
      const newCart = InsertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item])
      })

      await prisma.cart.create({
        data: newCart
      })

      // revalidate product page
      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: 'Item added to cart'
      }
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
