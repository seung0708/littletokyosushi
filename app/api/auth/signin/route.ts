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
    const { data: {user}, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError?.code === 'invalid_credentials') {
      return NextResponse.json({error: 'Invalid email or password'})
    } else {
      console.error('Unexpected error during sign in:', signInError);
    }
  
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return NextResponse.json({error: 'An unexpected error occurred'}, {status: 500})
  }
}