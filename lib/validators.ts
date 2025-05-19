import { z } from 'zod'
import { formatNumberWithDecimal } from './utils'

const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    'Price must have exactly two decimal places'
  )

export const InsertProductSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(32, 'Name must not be greater than 32 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(32, 'Slug must not be greater than 32 characters'),
  category: z
    .string()
    .min(3, 'Category must be at least 3 characters')
    .max(32, 'Category must not be greater than 32 characters'),
  brand: z
    .string()
    .min(3, 'Brand must be at least 3 characters')
    .max(32, 'Brand must not be greater than 32 characters'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters')
    .max(132, 'Description must not be greater than 132 characters'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'Product must have at least one image'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency
})

export const SignInFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be atleast 6 characters')
})

export const SignUpFormSchema = z
  .object({
    name: z.string().min(3, 'Name must be atleast 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be atleast 6 characters'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be atleast 6 characters')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ['confirmPassword']
  })

export const CartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().nonnegative('Quantity must be a positive number'),
  image: z.string().min(1, 'Image is required'),
  price: currency
})

export const InsertCartSchema = z.object({
  items: z.array(CartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'Session cart id is required'),
  userId: z.string().optional().nullable()
})
