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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Add the pathname to headers for server components to use
  const response = NextResponse.next()
  response.headers.set('x-pathname', pathname)

  // Skip if path is always allowed
  if (isAllowedPath(pathname)) {
    return response
  }

  // Check maintenance mode via internal API (Edge-compatible)
  try {
    const maintenanceCheckUrl = new URL('/api/maintenance', request.url)
    const maintenanceResponse = await fetch(maintenanceCheckUrl)
    const data = await maintenanceResponse.json()

    if (data.enabled) {
      const url = request.nextUrl.clone()
      url.pathname = '/coming-soon'
      return NextResponse.redirect(url)
    }
  } catch (error) {
    // If check fails, allow through to avoid blocking site
    console.error('[Middleware] Maintenance check failed:', error)
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
