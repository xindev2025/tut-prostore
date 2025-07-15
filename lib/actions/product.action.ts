'use server'
import { prisma } from '@/db/prisma'
import { convertToPlainObject } from '../utils'
import { PAGE_SIZE } from '../constants'

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
  console.log(page)
  console.log(limit)
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
