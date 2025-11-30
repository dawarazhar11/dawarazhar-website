import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that should always be accessible (even during maintenance)
const ALWAYS_ALLOWED_PATHS = [
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
  return ALWAYS_ALLOWED_PATHS.some(p => pathname.startsWith(p))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Add the pathname to headers for server components to use
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)

  // Skip if path is always allowed
  if (isAllowedPath(pathname)) {
    return response
  }

  // Check maintenance mode via environment variable
  // Set MAINTENANCE_MODE=true to enable maintenance mode
  const maintenanceEnabled = process.env.MAINTENANCE_MODE === 'true'

  if (maintenanceEnabled) {
    const url = request.nextUrl.clone()
    url.pathname = '/coming-soon'
    return NextResponse.redirect(url)
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
