// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/api/auth']
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith('/api/auth')
  )
  
  // Get the auth token from cookies
  const authCookie = request.cookies.get('auth-storage')?.value

  let token: string | null = null
  
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie)
      token = authData.state?.token || null
    } catch (error) {
      console.error('Error parsing auth cookie:', error)
      // Clear invalid cookie
      const response = NextResponse.next()
      response.cookies.delete('auth-storage')
      return response
    }
  }

  // If accessing protected route without token
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/', request.url)
    // Only add redirect if we're not already going to login
    if (path !== '/') {
      loginUrl.searchParams.set('redirect', path)
    }
    return NextResponse.redirect(loginUrl)
  }

  // If accessing root path with token, redirect to dashboard
  if (path === '/' && token) {
    // Check if there's a redirect parameter to avoid loops
    const redirectParam = request.nextUrl.searchParams.get('redirect')
    if (redirectParam && redirectParam !== '/') {
      return NextResponse.redirect(new URL(redirectParam, request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}