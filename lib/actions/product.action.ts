'use server'
import { PrismaClient } from '../generated/prisma'
import { convertToPlainObject } from '../utils'

export async function getListedProducts() {
  const prisma = new PrismaClient()
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' }
  })
  return convertToPlainObject(data)
}
