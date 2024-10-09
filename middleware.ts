import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Check for the authentication token
  const isAuthenticated = request.cookies.has('sb-access-token');
  
  // Check if the user is on the login page
  const isLoginPage = url.pathname === '/login';
  
  // Check if the request is to a protected route for admin
  const isAdminProtectedRoute = ['/admin', '/admin/login', '/admin/dashboard'].some(path => url.pathname.startsWith(path));

  // Check if the request is to a protected route for users
  const isUserProtectedRoute = ['/dashboard'].some(path => url.pathname.startsWith(path));

  // Redirect based on the subdomain
  const isAdminSubdomain = request.headers.get('host') === 'admin.localhost';
  const isUserSubdomain = request.headers.get('host') === 'localhost';

  // Logic for admin users
  if (isAdminSubdomain) {
    if (!isAuthenticated && !isLoginPage) {
      console.log("Redirecting to /admin/login from middleware");  // Debugging log
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    
    // Optionally, redirect authenticated admin users to a specific admin dashboard
    if (isAuthenticated && isLoginPage) {
      console.log("Redirecting authenticated admin to /admin/dashboard");
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  } 
  
  // Logic for regular users
  if (isUserSubdomain) {
    if (!isAuthenticated && !isLoginPage) {
      console.log("Redirecting to /login from middleware");  // Debugging log
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    // Optionally, redirect authenticated users to the main home page
    if (isAuthenticated && isLoginPage) {
      console.log("Redirecting authenticated user to /main/home");
      url.pathname = '/main/home';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}