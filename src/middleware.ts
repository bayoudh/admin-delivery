// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Public paths that don't require authentication
  const publicPaths = ['/']
  const isPublicPath = publicPaths.includes(path)
  
  // Get the auth token from cookies
  const authCookie = request.cookies.get('auth-storage')?.value
  let token: string | null = null

  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie)
      token = authData.state?.token || null
    } catch (error) {
      // Invalid cookie, treat as no token
      console.error('Error parsing auth cookie:', error)
    }
  }

  // Redirect to login if accessing protected route without token
  if (!isPublicPath && !token && path !== '/') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect to dashboard if accessing public routes with token
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}