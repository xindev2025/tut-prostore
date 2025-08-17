// export { auth as middleware } from '@/auth'

// export const runtime = 'nodejs'

import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export const { auth: middleware } = NextAuth(authConfig)
