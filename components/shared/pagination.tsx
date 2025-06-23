'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

type PaginationProps = {
  page: number | string
  totalPages: number
  urlParamName?: string
}

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter()

  const handleClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1
    router.push(`/user/orders?page=${pageValue}`)
  }

  return (
    <div className='flex gap-2'>
      <Button
        size={'lg'}
        variant={'outline'}
        className='w-28'
        disabled={Number(page) <= 1}
        onClick={() => handleClick('prev')}
      >
        Previous
      </Button>
      <Button
        size={'lg'}
        variant={'outline'}
        className='w-28'
        disabled={Number(page) >= totalPages}
        onClick={() => handleClick('next')}
      >
        Next
      </Button>
    </div>
  )
}

export default Pagination
