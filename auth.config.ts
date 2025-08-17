/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthConfig } from 'next-auth'
import { NextResponse } from 'next/server'

export const authConfig = {
  providers: [],
  callbacks: {
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
