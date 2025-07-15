'use client'
import { Product } from '@/types'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { InsertProductSchema, UpdateProductSchema } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { productDefaultValues } from '@/lib/constants'
import { Form } from '../ui/form'
const ProductForm = ({
  type,
  product,
  productId
}: {
  type: 'create' | 'update'
  product?: Product
  productId?: string
}) => {
  const form = useForm<
    z.infer<typeof InsertProductSchema> | z.infer<typeof UpdateProductSchema>
  >({
    resolver: zodResolver(
      type === 'update' ? UpdateProductSchema : InsertProductSchema
    ),
    defaultValues: product && type === 'update' ? product : productDefaultValues
  })

  return (
    <Form {...form}>
      <form className='space-y-8'>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* name */}
          {/* slug */}
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* category */}
          {/* brand */}
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* price */}
          {/* stock */}
        </div>
        <div className='upload-field flex flex-col md:flex-row gap-5'>
          {/* images */}
        </div>
        <div>{/* isFeatured */}</div>
        <div>{/* description */}</div>
        <div>{/* submit */}</div>
      </form>
    </Form>
  )
}

export default ProductForm
