/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from './lib/encrypt'
import { cookies } from 'next/headers'
import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
export const config = {
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-in'
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' }
      },
      async authorize(credentials) {
        if (credentials == null) return null

        // find user in db
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string
          }
        })
        // check if user exist and password match
        if (user?.id && user?.password) {
          const isMatch = await compare(
            credentials.password as string,
            user.password
          )
          // check if password is correct, return user
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          }
        }

        // if user does not exist or password does not match return null
        return null
      }
    })
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, user, trigger, token }: any) {
      // set the user id from the token
      session.user.id = token.sub
      session.user.name = token.name
      session.user.role = token.role
      // if there is update set user name
      if (trigger == 'update') {
        session.user.name = user.name
      }

      return session
    },
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id
        token.role = user.role
        // for google Oauth
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0]

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name }
          })
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies()
          const sessionCartId = cookiesObject.get('sessionCartId')?.value

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId }
            })

            if (sessionCart) {
              // delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id }
              })
              // assign new cart
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id }
              })
            }
          }
        }
      }

      // handle session update
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name
      }

      return token
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
