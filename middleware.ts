import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that should always be accessible during maintenance
const ALLOWED_PATHS = [
  '/admin',
  '/api',
  '/coming-soon',
  '/_next',
  '/favicon.ico',
]

// Check if path starts with any allowed prefix
function isAllowedPath(pathname: string): boolean {
  return ALLOWED_PATHS.some(path => pathname.startsWith(path))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip if path is allowed
  if (isAllowedPath(pathname)) {
    return NextResponse.next()
  }

  // Check maintenance mode via API (this is an internal call)
  try {
    const baseUrl = request.nextUrl.origin
    const response = await fetch(`${baseUrl}/api/maintenance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Use next: { revalidate: 10 } to cache for 10 seconds
      next: { revalidate: 10 }
    })

    if (response.ok) {
      const config = await response.json()

      if (config.enabled) {
        // Redirect to coming soon page
        return NextResponse.redirect(new URL('/coming-soon', request.url))
      }
    }
  } catch (error) {
    // If there's an error checking maintenance mode, allow the request
    console.error('Error checking maintenance mode:', error)
  }

  return NextResponse.next()
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
