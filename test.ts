import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.product.findMany()
  console.log(users)
}

main()
  .catch((e) => console.log(e))
  .finally(() => prisma.$disconnect())
