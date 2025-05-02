import { prisma } from '@/db/prisma'
import sampleData from './sample-data'
async function main() {
  await prisma.product.deleteMany()

  await prisma.product.createMany({ data: sampleData.products })

  console.log('seeded new data')
}

main()
