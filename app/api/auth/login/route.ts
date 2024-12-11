import { loginFormSchema } from '@/schema-validations/adminLogin';
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server';

export async function POST(req: Request) { 
  console.log('Starting login request');
  const body = await req.json(); 
  console.log('Login attempt for email:', body.email);
  
  const result = loginFormSchema.safeParse(body)
  if(!result.success) {
    console.error('Validation error:', result.error.errors);
    return NextResponse.json({error: result.error.errors}, {status: 400})
  }

  const {email, password} = result.data; 
  const supabase = await createClient()

  try {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email, 
      password
    })
    console.log(user, email, password)
    if (error) {
      console.error('Login error:', error);
      return NextResponse.json({error: error.message}, {status: 400})
    }
    
    console.log('Login successful for user:', {
      id: user?.id,
      email: user?.email,
      role: user?.role
    });

    // Check session after login
    const { data: { session } } = await supabase.auth.getSession()
    
    console.log('Login successful:', {
      hasSession: !!session,
      user: session?.user?.email
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return NextResponse.json({error: 'An unexpected error occurred'}, {status: 500})
  }
}