'use client'

import { Review } from '@/types'
import Link from 'next/link'
import { useState } from 'react'

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

  return (
    <div className='space-y-4'>
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <></>
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
