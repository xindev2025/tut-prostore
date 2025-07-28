import ProductCard from '@/components/shared/product/product-card'
import { getAllCategories, getAllProducts } from '@/lib/actions/product.action'
import Link from 'next/link'

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

  // prices
  const prices = [
    {
      name: '$1 to $50',
      value: '1-50'
    },
    {
      name: '$51 to $100',
      value: '51-100'
    },
    {
      name: '$101 to $151',
      value: '100-151'
    },
    {
      name: '$201 to $500',
      value: '201-500'
    },
    {
      name: '$500 to $1000',
      value: '500-1000'
    }
  ]

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

  const categories = await getAllCategories()

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='filter-links'>
        {/* category links */}
        <div className='text-xl mb-2 mt-3'>Department</div>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link
                href={getFilterUrl({ c: 'all' })}
                className={`${category === 'all' && 'font-bold'}`}
              >
                Any
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  href={getFilterUrl({ c: x.category })}
                  className={`${category === x.category && 'font-bold'}`}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='text-xl mb-2 mt-8'>Price</div>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link
                href={getFilterUrl({ p: 'all' })}
                className={`${price === 'all' && 'font-bold'}`}
              >
                Any
              </Link>
            </li>
            {prices.map((x) => (
              <li key={x.value}>
                <Link
                  href={getFilterUrl({ p: x.value })}
                  className={`${price === x.value && 'font-bold'}`}
                >
                  {x.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
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
