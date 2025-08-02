'use server'

import z from 'zod'
import { insertReviewSchema } from '../validators'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { formatError } from '../utils'
import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { revalidatePath } from 'next/cache'

export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth()

    if (!session) {
      throw new Error('User not authenticated')
    }

    // parse and store review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id
    })

    // check product
    const product = await prisma.product.findFirst({
      where: { id: review.productId }
    })

    if (!product) {
      throw new Error('Product not found')
    }

    // check if review exists
    const reviewExist = await prisma.review.findFirst({
      where: { productId: review.productId, userId: review.userId }
    })
    await prisma.$transaction(async (tx) => {
      if (reviewExist) {
        await tx.review.update({
          where: { id: reviewExist.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating
          }
        })
      } else {
        // create rating
        await tx.review.create({
          data: review
        })
      }
      // get avg rating
      const avgRating = await tx.review.aggregate({
        where: { productId: review.productId },
        _avg: { rating: true }
      })
      // get num reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId }
      })
      // update product
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: avgRating._avg.rating || 0,
          numReviews
        }
      })
    })

    revalidatePath(`/products/${product.slug}`)

    return {
      success: true,
      message: 'Review updated successfully'
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: formatError(error) }
  }
}
