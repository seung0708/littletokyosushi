import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)
  const path = request.nextUrl.pathname

  // Ensure cookies are accessible on both admin and main domains
  response.cookies.getAll().forEach(cookie => {
    if (cookie.name.includes('supabase')) {
      response.cookies.set({
        name: cookie.name,
        value: cookie.value,
        domain: '.localhost', // This allows sharing between subdomains
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      })
    }
  })

  // Rest of your admin middleware logic...
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    // ... rest of your code
  } catch (e) {
    return response
  }
}