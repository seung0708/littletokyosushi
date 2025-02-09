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
    // First try to sign in
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (signInError) {
      console.error('Login error:', signInError);
      return NextResponse.json({error: signInError.message}, {status: 400})
    }

    // After successful sign in, check if user exists
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({error: 'Authentication failed'}, {status: 401})
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return NextResponse.json({error: 'An unexpected error occurred'}, {status: 500})
  }
}