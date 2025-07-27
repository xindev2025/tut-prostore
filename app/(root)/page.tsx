import ProductCarousel from '@/components/shared/product/product-carousel'
import ProductList from '@/components/shared/product/product-list'
import {
  getFeatureProduct,
  getListedProducts
} from '@/lib/actions/product.action'

const Homepage = async () => {
  const latestProducts = await getListedProducts()
  const featuredProducts = await getFeatureProduct()
  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title='Newest Arrivals' />
    </>
  )
}

export default Homepage
