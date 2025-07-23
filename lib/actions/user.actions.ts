'use server'
import { auth, signIn, signOut } from '@/auth'
import {
  PaymentMethodSchema,
  ShippingAddressSchema,
  SignInFormSchema,
  SignUpFormSchema,
  updateUserDetailSchema,
  updateUserSchema
} from '../validators'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { hashSync } from 'bcrypt-ts-edge'
import { prisma } from '@/db/prisma'
import { formatError } from '../utils'
import { PaymentMethod, ShippingAddress } from '@/types'
import { PAGE_SIZE } from '../constants'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '../generated/prisma'

export async function signInUser(prevState: unknown, formData: FormData) {
  try {
    const user = SignInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password')
    })
    await signIn('credentials', user)
    return {
      success: true,
      message: 'Sign in Successfully'
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: 'Invalid email or password' }
  }
}

export async function signOutUser() {
  await signOut()
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = SignUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword')
    })

    const plainPassword = user.password

    user.password = hashSync(user.password, 10)

    // to create new user
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password
      }
    })
    // to sign in user after sign up
    await signIn('credentials', {
      email: user.email,
      password: plainPassword
    })

    return {
      success: true,
      message: 'User Registered Successfully'
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: formatError(error) }
  }
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('User not found')
  }

  return user
}

// update user address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    // get session
    const session = await auth()

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id }
    })
    // check user
    if (!currentUser) {
      throw new Error('User not found')
    }
    // parse data
    const address = ShippingAddressSchema.parse(data)

    // update user address
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { address }
    })

    return {
      success: true,
      message: 'User Update Address Successfully'
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: formatError(error) }
  }
}

// update user payment method
export async function updateUserPaymentMethod(data: PaymentMethod) {
  try {
    // get session
    const session = await auth()

    // check user
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id }
    })
    if (!currentUser) {
      throw new Error('User not found')
    }

    // parse data
    const paymentMethod = PaymentMethodSchema.parse(data)

    // update user payment method
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        paymentMethod: paymentMethod.type
      }
    })

    return {
      success: true,
      message: 'User Update Paymenth Method Successfully'
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: formatError(error) }
  }
}

// update user profile
export async function updateUserProfile(user: { name: string }) {
  try {
    const session = await auth()

    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id }
    })

    if (!currentUser) {
      throw new Error('User not found')
    }

    const data = updateUserSchema.parse(user)

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: data.name
      }
    })

    return {
      success: true,
      message: 'User Update Profile Successfully'
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: formatError(error) }
  }
}

// get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query
}: {
  limit?: number
  page: number
  query: string
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        }
      : {}

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit
  })

  const usersCount = await prisma.user.count({
    where: {
      ...queryFilter
    }
  })

  return {
    data,
    totalPages: Math.ceil(usersCount / limit)
  }
}

// delete user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id }
    })

    revalidatePath('/admin/users')

    return {
      success: true,
      message: 'User deleted successfully'
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: formatError(error) }
  }
}

// update user detail
export async function updateUserDetails(
  user: z.infer<typeof updateUserDetailSchema>
) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role
      }
    })

    revalidatePath('/admin/users')

    return {
      success: true,
      message: 'User updated successfully'
    }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return { success: false, message: formatError(error) }
  }
}
