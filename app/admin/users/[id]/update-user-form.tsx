'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { USER_ROLES } from '@/lib/constants'
import { updateUserDetailSchema } from '@/lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import { z } from 'zod'

const UpdateUserForm = ({
  user
}: {
  user: z.infer<typeof updateUserDetailSchema>
}) => {
  const form = useForm<z.infer<typeof updateUserDetailSchema>>({
    resolver: zodResolver(updateUserDetailSchema),
    defaultValues: user
  })

  const onSubmit = () => {
    return
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <FormField
            control={form.control}
            name='email'
            render={({
              field
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserDetailSchema>,
                'email'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name='name'
            render={({
              field
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserDetailSchema>,
                'name'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name='role'
            render={({
              field
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserDetailSchema>,
                'role'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a role' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex-between'>
          <Button
            type='submit'
            className='w-full'
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Update User'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UpdateUserForm
