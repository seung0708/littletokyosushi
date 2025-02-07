import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  
  const hostname = request.headers.get('host')
  const path = request.nextUrl.pathname
  const response = NextResponse.next()

  try {
    const supabase = await createClient()

    // Only apply admin auth protection to admin subdomain
    if (hostname?.startsWith('admin.')) {

      // Check authentication first for root path
      if (path === '/') {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          return NextResponse.redirect(new URL('/orders', request.url))
        } else {
          return NextResponse.redirect(new URL('/signin', request.url))
        }
      }
      
      // Skip auth check for these paths
      const publicPaths = ['/signin', '/api/auth/signin']
      if (publicPaths.includes(path)) {
        return response
      }
      // Check authentication for protected routes
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return NextResponse.redirect(new URL('/signin', request.url))
      }

      // First get the employee record
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('id')
        .eq('id', user.id)
        .single();

      console.log('Employee check:', employeeData ? 'Found employee' : 'No employee found', employeeError ? `Error: ${employeeError.message}` : '');

      // Then check admin role using employee ID
      const { data: roleData, error: roleError } = await supabase
        .from('employees')
        .select(`
          employee_roles (
            roles (
              name
            )
          )
        `)
        .eq('id', employeeData?.id)
        .single();

      //console.log('Role check:', { roleData, roleError });
      
      const hasAdminRole = roleData?.employee_roles?.some(
        (er: any) => er.roles?.name === 'admin'
      );

      if (roleError || !hasAdminRole) {
        return NextResponse.redirect(new URL('/signin', request.url))
      }
    }

    if (!hostname?.startsWith('admin.') && path === '/signin') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return response
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    return NextResponse.next()
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