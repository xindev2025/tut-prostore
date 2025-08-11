import { prisma } from '@/db/prisma'
import sampleData from './sample-data'
import { hash } from '@/lib/encrypt'
async function main() {
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.verificationToken.deleteMany()

  await prisma.product.createMany({ data: sampleData.products })

  const users = []
  for (let index = 0; index < sampleData.users.length; index++) {
    users.push({
      ...sampleData.users[index],
      password: await hash(sampleData.users[index].password)
    })
  }
  await prisma.user.createMany({ data: sampleData.users })

  console.log('seeded new data')
}

main()
