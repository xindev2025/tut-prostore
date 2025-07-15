'use server'
import { prisma } from '@/db/prisma'
import { convertToPlainObject, formatError } from '../utils'
import { PAGE_SIZE } from '../constants'
import { revalidatePath } from 'next/cache'

export async function getListedProducts() {
  try {
    const data = await prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' }
    })
    return convertToPlainObject(data)
  } catch (error) {
    console.log('server errror', error)
    return []
  }
}

export async function getProductBySlug({ slug }: { slug: string }) {
  const product = await prisma.product.findFirst({
    where: {
      slug
    }
  })

  return convertToPlainObject(product)
}

// get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category
}: {
  query: string
  limit?: number
  page: number
  category?: string
}) {
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit
  })

  const dataCount = await prisma.product.count()

  return {
    data,
    totalPage: Math.ceil(dataCount / limit)
  }
}

// delete product
export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    await prisma.product.delete({
      where: { id }
    })

    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Successfully delete product'
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
