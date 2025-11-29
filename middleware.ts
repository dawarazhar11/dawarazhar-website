import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that should always be accessible during maintenance
const ALLOWED_PATHS = [
  '/admin',
  '/api',
  '/coming-soon',
  '/_next',
  '/favicon.ico',
  '/images',
  '/robots.txt',
  '/sitemap.xml',
]

// Check if path starts with any allowed prefix
function isAllowedPath(pathname: string): boolean {
  return ALLOWED_PATHS.some(path => pathname.startsWith(path))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Add the pathname to headers for server components to use
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)

  // Skip if path is allowed
  if (isAllowedPath(pathname)) {
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
