import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname === '/login'
  const isOnApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth')

  // Allow API auth routes
  if (isOnApiAuthRoute) {
    return NextResponse.next()
  }

  // Redirect to customers if logged in and trying to access login page
  if (isLoggedIn && isOnLoginPage) {
    return NextResponse.redirect(new URL('/customers', req.url))
  }

  // Redirect to login if not logged in and not on login page
  if (!isLoggedIn && !isOnLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
