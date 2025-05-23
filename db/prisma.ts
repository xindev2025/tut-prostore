import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@/lib/generated/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import ws from 'ws'

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws

const connectionString = `${process.env.DATABASE_URL}`

if (!connectionString) throw new Error('DATABASE_URL is not set')

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
// const pool = new Pool({ connectionString })
// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon({ connectionString })

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product: { price: Decimal }) {
          return product.price.toString()
        }
      },
      rating: {
        compute(product: { rating: Decimal }) {
          return product.rating.toString()
        }
      }
    }
  }
})
