'use server'

import { CartItem } from '@/types'
import { convertToPlainObject, formatError, round2 } from '../utils'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { CartItemSchema, InsertCartSchema } from '../validators'
import { revalidatePath } from 'next/cache'
import { Prisma } from '../generated/prisma'

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

    // check if cart exist
    if (!cart) {
      const newCart = InsertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item])
      })

      // create new cart
      await prisma.cart.create({
        data: newCart
      })

      // revalidate product page
      revalidatePath(`/product/${product.slug}`)

      return {
        success: true,
        message: `${product.name} added to cart`
      }
    }

    const existItems = cart.items.find((item) => item.productId === product.id)

    if (existItems) {
      if (product.stock < existItems.qty + 1) {
        throw new Error('Not enough stock')
      }

      cart.items.find((item) => item.productId === product.id)!.qty =
        existItems.qty + 1
    }
    if (!existItems) {
      if (product.stock < 1) {
        throw new Error('Not enough stock')
      }
      cart.items.push(item)
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items)
      }
    })

    // revalidate product page
    revalidatePath(`/product/${product.slug}`)

    return {
      success: true,
      message: `${product.name} ${existItems ? 'updated in' : 'added to'} cart`
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}

export async function getMyCart() {
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
}

export async function removeItemFromCart(productId: string) {
  try {
    // check for cart cokkie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value
    if (!sessionCartId) throw new Error('Cart session not found')

    // get product
    const product = await prisma.product.findFirst({
      where: { id: productId }
    })

    if (!product) throw new Error('No product found')

    // get user cart
    const cart = await getMyCart()
    if (!cart) throw new Error('Cart not found')

    // check for item
    const productExist = cart.items.find(
      (product) => product.productId === productId
    )
    if (!productExist) throw new Error('Product not found')
    // check if product only have 1 qty
    if (productExist.qty === 1) {
      // remove from cart
      cart.items = cart.items.filter(
        (product) => product.productId !== productId
      )
    } else {
      // decrease qty
      cart.items.find((product) => product.productId === productId)!.qty =
        productExist.qty - 1
    }

    // update cart
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items)
      }
    })

    // refresh page
    revalidatePath(`/product/${product.slug}`)

    return {
      success: true,
      message: `${product.name} was remove from cart`
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error)
    }
  }
}
