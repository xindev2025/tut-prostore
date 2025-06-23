import { getUserOrders } from '@/lib/actions/order.action'

const OrderPage = async (props: {
  searchParams: Promise<{
    page: string
  }>
}) => {
  const { page } = await props.searchParams

  const orders = await getUserOrders({
    page: Number(page) || 1
  })
  console.log(orders)
  return <>Order</>
}

export default OrderPage
