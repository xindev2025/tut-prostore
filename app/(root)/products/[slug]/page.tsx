import AddToCart from '@/components/shared/product/add-to-cart'
import ProductImages from '@/components/shared/product/product-images'
import ProductPrice from '@/components/shared/product/product-price'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getProductBySlug } from '@/lib/actions/product.action'
import { notFound } from 'next/navigation'

const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await props.params
  const product = await getProductBySlug({ slug })

  if (!product) notFound()

  return (
    <section className='grid grid-cols-1 md:grid-cols-5'>
      <div className='col-span-2'>
        <ProductImages images={product.images} />
      </div>
      <div className='col-span-2 p-5'>
        <div className='flex flex-col gap-6'>
          <p>
            {product.brand} {product.category}
          </p>
          <h1 className='h3-bold'>{product.name}</h1>
          <p>
            {product.rating} of {product.numReviews} Reviews
          </p>
          <div className='flex-flex-col sm:flex-row sm:items-center gap-3'>
            <ProductPrice
              value={Number(product.price)}
              classname='w-24 rounded-full bg-green-100 text-green-500 px-5 py-2'
            />
          </div>
        </div>
        <div className='mt-10'>
          <p className='font-semibold'>Description</p>
          <p>{product.description}</p>
        </div>
      </div>
      <div>
        <Card>
          <CardContent className='px-4'>
            <div className='mb-2 flex justify-between'>
              <div>Price</div>
              <div>
                <ProductPrice value={Number(product.price)} />
              </div>
            </div>
            <div className='mb-2 flex justify-between'>
              <div>Status</div>
              {product.stock > 0 ? (
                <Badge variant={'outline'}>In Stock</Badge>
              ) : (
                <Badge variant={'destructive'}>Out Of Stock</Badge>
              )}
            </div>
            {product.stock > 0 && (
              <div className='flex-center'>
                <AddToCart
                  item={{
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    image: product.images[0],
                    qty: 1
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default ProductDetailsPage
