'use server'
import { prisma } from '@/db/prisma'
import { convertToPlainObject, formatError } from '../utils'
import { PAGE_SIZE } from '../constants'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { InsertProductSchema, UpdateProductSchema } from '../validators'

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

export async function getProductById(productId: string) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId
    }
  })

  return convertToPlainObject(product)
}

// get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort
}: {
  query: string
  limit?: number
  page: number
  category?: string
  price?: string
  rating?: string
  sort?: string
}) {
  const data = await prisma.product.findMany({
    where: {
      ...(query &&
        query !== 'all' && {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        })
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit
  })

  const dataCount = await prisma.product.count({
    where: {
      name: {
        contains: query,
        mode: 'insensitive'
      }
    }
  })

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

// create product
export async function createProduct(data: z.infer<typeof InsertProductSchema>) {
  try {
    const product = InsertProductSchema.parse(data)
    await prisma.product.create({ data: product })

    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Successfully create product'
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// update product
export async function updateProduct(data: z.infer<typeof UpdateProductSchema>) {
  try {
    const product = UpdateProductSchema.parse(data)

    const productExist = await prisma.product.findFirst({
      where: { id: product.id }
    })

    if (!productExist) {
      throw new Error('Product not found')
    }

    await prisma.product.update({
      where: { id: product.id },
      data: product
    })

    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Successfully update product'
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true
  })

  return data
}

// get all feature products
export async function getFeatureProduct() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4
  })

  return convertToPlainObject(data)
}
