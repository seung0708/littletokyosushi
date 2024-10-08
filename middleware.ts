import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Temporarily disable updateSession to ensure it's not the cause
  // const response = await updateSession(request);

  const isAuthenticated = request.cookies.has('sb-access-token');
  const isLoginPage = url.pathname === '/login';
  const isProtectedRoute = ['/admin', '/dashboard'].some(path => url.pathname.startsWith(path));

  if (!isAuthenticated && isProtectedRoute && !isLoginPage) {
    console.log("Redirecting to /login from middleware");  // Debugging log
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}