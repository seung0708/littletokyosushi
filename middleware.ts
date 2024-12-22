import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function middleware(request: NextRequest) {
  // Get hostname (e.g. admin.localhost:3000, localhost:3000, etc.)
  const hostname = request.headers.get('host')
  const path = request.nextUrl.pathname
  const response = NextResponse.next()
  const supabase = await createClient()

  // Only apply admin auth protection to admin subdomain
  if (hostname?.startsWith('admin.')) {
    //console.log('Checking admin auth for path:', path);
    
    // Skip auth check for these paths
    const publicPaths = ['/login', '/api/auth/signin']
    if (publicPaths.includes(path)) {
      return response
    }
    // Check authentication for protected routes
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('No user found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // First get the employee record
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('id')
      .eq('id', user.id)
      .single();

    if (employeeError || !employeeData) {
      console.log('No employee record found:', employeeError);
      return NextResponse.redirect(new URL('/login', request.url))
    }

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
      .eq('id', employeeData.id)
      .single();

    //console.log('Role check:', { roleData, roleError });
    
    const hasAdminRole = roleData?.employee_roles?.some(
      (er: any) => er.roles?.name === 'admin'
    );

    if (roleError || !hasAdminRole) {
      console.log('User is not admin, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url))
    }

    //console.log('Admin access granted');
  }

  return response
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