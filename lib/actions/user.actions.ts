'use server'
import { signIn, signOut } from '@/auth'
import { SignInFormSchema, SignUpFormSchema } from '../validators'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { hashSync } from 'bcrypt-ts-edge'
import { prisma } from '@/db/prisma'
import { formatError } from '../utils'

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
