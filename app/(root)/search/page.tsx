import ProductCard from '@/components/shared/product/product-card'
import { Button } from '@/components/ui/button'
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

  // ratings
  const ratings = [5, 4, 3, 2, 1]

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
    const params: Record<string, string> = {
      category,
      q,
      price,
      rating,
      sort,
      page
    }

    if (c) params.category = c
    if (p) params.price = p
    if (s) params.sort = s
    if (r) params.rating = r
    if (pg) params.page = pg

    return `/search?${new URLSearchParams(params).toString()}`
  }

  // const sort orders
  const sortOrders = ['newest', 'lowest', 'highest', 'rating']

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
        <div className='text-xl mb-2 mt-8'>Prices</div>
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
        <div className='text-xl mb-2 mt-8'>Ratings</div>
        <div>
          <ul className='space-y-1'>
            <li>
              <Link
                href={getFilterUrl({ r: 'all' })}
                className={`${rating === 'all' && 'font-bold'}`}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  href={getFilterUrl({ r: `${r}` })}
                  className={`${rating === r.toString() && 'font-bold'}`}
                >
                  {`${r} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='md:col-span-4 space-y-4'>
        <div className='flex-between flex-col md:flex-row my-4'>
          <div className='flex items-center gap-2'>
            <div>{q !== 'all' && q !== '' && `Query: ${q}`}</div>
            <div>
              {category !== 'all' && category !== '' && `Category: ${category}`}
            </div>
            <div>{price !== 'all' && `Price: ${price}`}</div>
            <div>{rating !== 'all' && `Rating: ${rating} stars & up`}</div>
            <div>
              {['q', 'category', 'price', 'rating'].some((key) => {
                const val = { q, category, price, rating }[key]
                return val && val != 'all' && val != ''
              }) && (
                <Button variant={'link'} asChild>
                  <Link href={'/search'}>Clear</Link>
                </Button>
              )}
            </div>
          </div>
          <div>
            Sort by
            {sortOrders.map((srt) => (
              <Link
                href={getFilterUrl({ s: srt })}
                key={srt}
                className={`mx-2 ${sort === srt && 'font-bold'}`}
              >
                {srt}
              </Link>
            ))}
          </div>
        </div>
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
