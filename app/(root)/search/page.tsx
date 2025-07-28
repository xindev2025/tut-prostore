import ProductCard from '@/components/shared/product/product-card'
import { getAllProducts } from '@/lib/actions/product.action'

const SearchPage = async (props: {
  searchParams: Promise<{
    category?: string
    q?: string
    price?: string
    rating?: string
    sort?: string
    page?: string
  }>
}) => {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1'
  } = await props.searchParams

  // url filters
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg
  }: {
    c?: string
    s?: string
    p?: string
    r?: string
    pg?: string
  }) => {
    const params: Record<string, string> = {}

    if (c) params.category = c
    if (p) params.price = p
    if (s) params.sort = s
    if (r) params.rating = r
    if (pg) params.page = pg

    return `/search?${new URLSearchParams(params).toString()}`
  }

  const products = await getAllProducts({
    page: Number(page),
    query: q,
    category,
    limit: 5,
    price,
    rating,
    sort
  })

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='filter-links'>{/* filters */}</div>
      <div className='md:col-span-4 space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {products.data.length === 0 && <div>No products found</div>}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPage
