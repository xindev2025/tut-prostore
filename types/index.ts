import {
  CartItemSchema,
  InsertCartSchema,
  InsertProductSchema,
  PaymentMethodSchema,
  ShippingAddressSchema
} from '@/lib/validators'
import { z } from 'zod'

export type Product = z.infer<typeof InsertProductSchema> & {
  id: string
  rating: string
  createdAt: Date
}

export type Cart = z.infer<typeof InsertCartSchema>
export type CartItem = z.infer<typeof CartItemSchema>
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>
