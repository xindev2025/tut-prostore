import NextAuth, { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db/prisma'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compareSync } from 'bcrypt-ts-edge'

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
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        // for google Oauth
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0]

          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name }
          })
        }
      }
      return token
    }
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
