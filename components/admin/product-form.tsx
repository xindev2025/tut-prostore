'use client'
import { Product } from '@/types'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import { z } from 'zod'
import { InsertProductSchema, UpdateProductSchema } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { productDefaultValues } from '@/lib/constants'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
const ProductForm = ({
  type,
  product,
  productId
}: {
  type: 'create' | 'update'
  product?: Product
  productId?: string
}) => {
  const form = useForm<
    z.infer<typeof InsertProductSchema> | z.infer<typeof UpdateProductSchema>
  >({
    resolver: zodResolver(
      type === 'update' ? UpdateProductSchema : InsertProductSchema
    ),
    defaultValues: product && type === 'update' ? product : productDefaultValues
  })

  return (
    <Form {...form}>
      <form className='space-y-8'>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* name */}
          <FormField
            control={form.control}
            name='name'
            render={({
              field
            }: {
              field: ControllerRenderProps<
                z.infer<typeof InsertProductSchema>,
                'name'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* slug */}
          <FormField
            control={form.control}
            name='slug'
            render={({
              field
            }: {
              field: ControllerRenderProps<
                z.infer<typeof InsertProductSchema>,
                'slug'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input placeholder='Enter slug' {...field} />
                    <Button
                      type='button'
                      className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2'
                      onClick={() => {
                        form.setValue(
                          'slug',
                          form
                            .getValues('name')
                            .replaceAll(' ', '-')
                            .toLowerCase()
                        )
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* category */}
          <FormField
            control={form.control}
            name='category'
            render={({
              field
            }: {
              field: ControllerRenderProps<
                z.infer<typeof InsertProductSchema>,
                'category'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder='Enter category' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* brand */}
          <FormField
            control={form.control}
            name='brand'
            render={({
              field
            }: {
              field: ControllerRenderProps<
                z.infer<typeof InsertProductSchema>,
                'brand'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder='Enter brand' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* price */}
          <FormField
            control={form.control}
            name='price'
            render={({
              field
            }: {
              field: ControllerRenderProps<
                z.infer<typeof InsertProductSchema>,
                'price'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* stock */}
          <FormField
            control={form.control}
            name='stock'
            render={({
              field
            }: {
              field: ControllerRenderProps<
                z.infer<typeof InsertProductSchema>,
                'stock'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder='Enter stock' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field flex flex-col md:flex-row gap-5'>
          {/* images */}
        </div>
        <div>{/* isFeatured */}</div>
        <div>
          {/* description */}
          <FormField
            control={form.control}
            name='description'
            render={({
              field
            }: {
              field: ControllerRenderProps<
                z.infer<typeof InsertProductSchema>,
                'description'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Enter description'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          {/* submit */}
          <Button
            type='button'
            size={'lg'}
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting' : `${type} Product`}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm
