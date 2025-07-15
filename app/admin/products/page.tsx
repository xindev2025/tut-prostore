import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { deleteProduct, getAllProducts } from '@/lib/actions/product.action'
import { requireAdmin } from '@/lib/auth-guard'
import { formatCurrency, formatId } from '@/lib/utils'
import Link from 'next/link'

const ProductsPage = async (props: {
  searchParams: Promise<{
    page: string
    query: string
    category: string
  }>
}) => {
  // admin authorization
  await requireAdmin()

  const searchParams = await props.searchParams

  const page = Number(searchParams.page) || 1
  const searchText = searchParams.query || ''
  const category = searchParams.category || ''

  const products = await getAllProducts({
    query: searchText,
    page,
    category
  })

  return (
    <div className='space-y-2'>
      <div className='flex-between'>
        <div className='h2-bold'>Products</div>
        <Button asChild variant={'default'}>
          <Link href={'/admin/products/create'}>Create Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className='text-right'>PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className='w-[100px]'>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className='text-right'>
                {formatCurrency(product.price)}
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.rating}</TableCell>
              <TableCell className='flex gap-1'>
                <Button asChild variant={'outline'} size={'sm'}>
                  <Link href={`/admin/products/${product.id}`}>Edit</Link>
                </Button>
                <DeleteDialog id={product.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products.totalPage > 1 && (
        <Pagination
          page={page}
          totalPages={products.totalPage}
          urlParamName='admin/products'
        />
      )}
    </div>
  )
}

export default ProductsPage
