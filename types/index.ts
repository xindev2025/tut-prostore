import {
  CartItemSchema,
  InsertCartSchema,
  InsertProductSchema
} from '@/lib/validators'
import { z } from 'zod'

export type Product = z.infer<typeof InsertProductSchema> & {
  id: string
  rating: string
  createdAt: Date
}

export type Cart = z.infer<typeof InsertCartSchema>
export type CartItem = z.infer<typeof CartItemSchema>
