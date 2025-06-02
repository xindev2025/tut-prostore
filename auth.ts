import NextAuth, { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const config = {
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-in'
  },
  session: {
    strategy: 'jwt',
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
          const isMatch = compareSync(
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

      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name
      }
      return token
    },
    authorized({ request, auth }: any) {
      // protected paths
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/
      ]

      // get pathname
      const { pathname } = request.nextUrl
      // check if not authorized and accessing the protected path
      if (!auth && protectedPaths.some((path) => path.test(pathname)))
        return false

      // check for session cart cookie
      if (!request.cookies.get('sessionCartId')) {
        // generate new session card id cookie
        const sessionCartId = crypto.randomUUID()

        // clone req headers
        const newRequestHeaders = new Headers(request.headers)

        // create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders
          }
        })

        // set session cart id in the response cookies
        response.cookies.set('sessionCartId', sessionCartId)

        return response
      } else {
        return true
      }
    }
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
