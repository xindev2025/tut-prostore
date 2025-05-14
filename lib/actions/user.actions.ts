'use server'
import { signIn, signOut } from '@/auth'
import { SignInFormSchema } from '../validators'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

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
