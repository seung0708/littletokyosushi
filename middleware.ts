import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  // Get hostname (e.g. admin.localhost:3000, localhost:3000, etc.)
  const hostname = request.headers.get('host')
  const path = request.nextUrl.pathname

  // Only apply auth protection to admin subdomain
  if (hostname?.startsWith('admin.')) {
    // Skip auth check for these paths
    const publicPaths = ['/login', '/api/auth/login']
    if (publicPaths.includes(path)) {
      return NextResponse.next()
    }

    // Check authentication for protected routes
    const response = NextResponse.next()
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}