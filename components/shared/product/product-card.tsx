import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import ProductPrice from './product-price'
import { Product } from '@/types'

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className='w-full max-w-sm'>
      <CardHeader className='p-0 items-center'>
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0]}
            height={300}
            width={300}
            alt={product.name}
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className='grid gap-4 p-4'>
        <div className='text-xs'>{product.brand}</div>
        <Link href={`/products/${product.slug}`}>
          <h2 className='text-sm font-medium'>{product.name}</h2>
        </Link>
        <div className='flex-between gap-4'>
          <p>{product.rating} stars</p>
          {product.stock > 0 ? (
            <div className='font-bold'>
              <ProductPrice value={Number(product.price)} />
            </div>
          ) : (
            <div className='text-destructive'>Out of Stock</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
