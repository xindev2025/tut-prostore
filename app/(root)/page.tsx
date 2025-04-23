import ProductList from '@/components/shared/product/product-list'
import { getListedProducts } from '@/lib/actions/product.action'

const Homepage = async () => {
  const latestProducts = await getListedProducts()

  return <ProductList data={latestProducts} title='Newest Arrivals' />
}

export default Homepage
