'use client'
import { ShippingAddressSchema } from '@/lib/validators'
import { ShippingAddress } from '@/types'
import { z } from 'zod'
import { useForm, ControllerRenderProps, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { shippingAddressDefaultValues } from '@/lib/constants'
import { useTransition } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader } from 'lucide-react'
import { updateUserAddress } from '@/lib/actions/user.actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof ShippingAddressSchema>>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues
  })

  const [isPending, startTransition] = useTransition()

  const onSubmit: SubmitHandler<z.infer<typeof ShippingAddressSchema>> = async (
    values
  ) => {
    startTransition(async () => {
      const res = await updateUserAddress(values)

      if (!res.success) {
        toast('Failed Update', {
          description: res.message
        })
      }

      router.push('/payment-method')
    })
  }

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <h1 className='h1-bold mt-4'>Shipping Address</h1>
      <p className='text-sm text-muted-foreground'>
        Please enter address to ship to
      </p>
      <Form {...form}>
        <form
          method='post'
          className='space-y-4'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='flex flex-col md:flex-row gap-5'>
            <FormField
              control={form.control}
              name='fullName'
              render={({
                field
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof ShippingAddressSchema>,
                  'fullName'
                >
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter full name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col md:flex-row gap-5'>
            <FormField
              control={form.control}
              name='streetAddress'
              render={({
                field
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof ShippingAddressSchema>,
                  'streetAddress'
                >
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter address' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col md:flex-row gap-5'>
            <FormField
              control={form.control}
              name='city'
              render={({
                field
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof ShippingAddressSchema>,
                  'city'
                >
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter city' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col md:flex-row gap-5'>
            <FormField
              control={form.control}
              name='postalCode'
              render={({
                field
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof ShippingAddressSchema>,
                  'postalCode'
                >
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Postal code</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter postal code' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col md:flex-row gap-5'>
            <FormField
              control={form.control}
              name='country'
              render={({
                field
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof ShippingAddressSchema>,
                  'country'
                >
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter country' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-2'>
            <Button type='submit' disabled={isPending}>
              {isPending ? (
                <Loader className='w-4 h-4 animate-spin' />
              ) : (
                <ArrowRight className='w-4 h-4' />
              )}{' '}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ShippingAddressForm
