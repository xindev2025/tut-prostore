'use client'

import { Review } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import ReviewForm from './review-form'

const ReviewList = ({
  userId,
  productId,
  productSlug
}: {
  userId: string
  productId: string
  productSlug: string
}) => {
  const [reviews, setReviews] = useState<Review[]>([])

  const reload = () => {
    console.log('review')
  }

  return (
    <div className='space-y-4'>
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <ReviewForm
          productId={productId}
          userId={userId}
          onSubmitReview={reload}
        />
      ) : (
        <div>
          Please
          <Link
            className='text-blue-700 px-2'
            href={`/sign-in?callbackUrl=/products/${productSlug}`}
          >
            Sign In
          </Link>
          to write review
        </div>
      )}
      <div className='flex flex-col gap-3'></div>
    </div>
  )
}

export default ReviewList
