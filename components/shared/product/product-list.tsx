import ProductCard from './product-card'

const ProductList = ({
  data,
  title,
  limit
}: {
  data: any
  title?: string
  limit?: number
}) => {
  const limited = limit ? data.slice(0, limit) : data
  return (
    <div className='my-2'>
      <h2 className='h2-bold mb-2'>{title}</h2>
      {data.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {limited.map((product: any) => (
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
