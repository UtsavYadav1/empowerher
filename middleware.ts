import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/', '/about', '/gallery', '/workshops', '/contact']

// Auth routes
const authRoutes = ['/login', '/register']

// Role-based dashboard routes
const roleRoutes = ['/girls', '/women', '/customer', '/admin', '/fieldagent']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
  
  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if route is auth route (login/register)
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Get token from cookie or header (for SSR)
  // For client-side, we'll handle auth in the components
  // This middleware is mainly for SSR protection
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

