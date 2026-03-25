import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  // Redirect to admin dashboard if user is already signed in
  if (request.nextUrl.pathname === '/signin' && user) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }
  
  // Ensure cookies are accessible on both admin and main domains
  response.cookies.getAll().forEach(cookie => {
    if (cookie.name.includes('supabase')) {
      response.cookies.set({
        name: cookie.name,
        value: cookie.value,
        //domain: '.localhost', // This allows sharing between subdomains
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      })
    }
  })

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}