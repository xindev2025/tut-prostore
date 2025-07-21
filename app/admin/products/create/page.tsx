import ProductForm from '@/components/admin/product-form'
import { requireAdmin } from '@/lib/auth-guard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Product'
}

const CreateProductPage = async () => {
  await requireAdmin()

  return (
    <>
      <h2 className='h2-bold'>Create Product</h2>
      <div className='my-8'>
        <ProductForm type='create' />
      </div>
    </>
  )
}

export default CreateProductPage
