import { Product } from '@/types'
import ProductCard from './product-card'

const ProductList = ({ data, title }: { data: Product[]; title?: string }) => {
  return (
    <div className='my-2'>
      <h2 className='h2-bold mb-2'>{title}</h2>
      {data.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {data.map((product: Product) => (
            <ProductCard product={product} key={product.name} />
          ))}
        </div>
      ) : (
        <div>
          <p>No Products found</p>
        </div>
      )}
    </div>
  )
}

export default ProductList
