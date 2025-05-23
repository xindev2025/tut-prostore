'use server'
import { prisma } from '@/db/prisma'
import { convertToPlainObject } from '../utils'

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
