import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Public routes
    if (path === '/login' || path === '/signup') {
      if (token) {
        return NextResponse.redirect(new URL('/', req.url))
      }
      return NextResponse.next()
    }

    // Protected routes - require authentication
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true // Let the middleware handle it
    }
  }
)

export const config = {
  matcher: [
    '/',
    '/campaigns',
    '/api/campaigns/:path*',
    '/login',
    '/signup',
  ]
}