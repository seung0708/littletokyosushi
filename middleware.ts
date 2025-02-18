import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const cookieStore = request.cookies
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          detectSessionInUrl: true,
          flowType: 'pkce',
          persistSession: true,
          storage: {
            getItem: (key) => cookieStore.get(key)?.value ?? null,
            setItem: (key, value) => {
              cookieStore.set(key, value)
              return
            },
            removeItem: (key) => {
              cookieStore.delete(key)
              return
            },
          },
        },
      }
    )


    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
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