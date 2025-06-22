import {
  CartItemSchema,
  InsertCartSchema,
  insertOrderItemSchema,
  InsertOrderSchema,
  InsertProductSchema,
  PaymentMethodSchema,
  paymentResultSchema,
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

export type OrderItem = z.infer<typeof insertOrderItemSchema>
export type Order = z.infer<typeof InsertOrderSchema> & {
  id: string
  createdAt: Date
  isPaid: boolean
  paidAt: Date | null
  isDelivered: boolean
  deliveredAt: Date | null
  orderItem: OrderItem[]
  user: { name: string; email: string }
}

export type PaymentResult = z.infer<typeof paymentResultSchema>
