import { InsertProductSchema } from '@/lib/validators'
import { z } from 'zod'

export type Product = z.infer<typeof InsertProductSchema> & {
  id: string
  rating: string
  createdAt: Date
}
