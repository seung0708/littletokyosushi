import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  
  // Ensure cookies are accessible on both admin and main domains
  response.cookies.getAll().forEach(cookie => {
    if (cookie.name.includes('supabase')) {
      response.cookies.set({
        name: cookie.name,
        value: cookie.value,
        //domain: 
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