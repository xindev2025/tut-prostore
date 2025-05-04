/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient, Prisma } from '@prisma/client'
import ws from 'ws'

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws

const connectionString = `${process.env.DATABASE_URL}`

if (!connectionString) throw new Error('DATABASE_URL is not set')

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString })
// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon({ connectionString })

type Product = {
  price: Prisma.Decimal | null
  rating: Prisma.Decimal | null
  name: string
  id: string
  slug: string
  category: string
  images: string[]
  brand: string
  description: string
  stock: number
  numReviews: number
  isFeatured: boolean
  banner: string | null
  createdAt: Date
}

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product: Product) {
          return product.price?.toString() ?? null
        }
      },
      rating: {
        compute(product: Product) {
          return product.rating?.toString() ?? null
        }
      }
    }
  }
})
