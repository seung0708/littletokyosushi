import { signinFormSchema } from '@/schema-validations/auth';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json(); 
  
  const result = signinFormSchema.safeParse(body)
  if(!result.success) {
    console.error('Validation error:', result.error.errors);
    return NextResponse.json({error: result.error.errors}, {status: 400})
  }

  const {email, password} = result.data; 
  const supabase = await createClient();

  try {
    const { data: { user}, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Sign in error:', signInError);
      return NextResponse.json({
        error: signInError.message
      }, { 
        status: signInError.status || 400 
      });
    }

    const response = NextResponse.json(user);

    // // Set auth cookies
    // response.cookies.set('sb-access-token', data.session?.access_token || '', {
    //   path: '/',
    //   sameSite: 'lax',
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 60 * 60 // 1 hour
    // });

    // response.cookies.set('sb-refresh-token', data.session?.refresh_token || '', {
    //   path: '/',
    //   sameSite: 'lax',
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 60 * 60 * 24 * 7 // 1 week
    // });

    return response;

  } catch (error) {
    console.error('Unexpected error during login:', error);
    return NextResponse.json({error: 'An unexpected error occurred'}, {status: 500})
  }
}