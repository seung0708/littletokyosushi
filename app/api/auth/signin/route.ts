import { signinFormSchema } from '@/schema-validations/auth';
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server';

export async function POST(req: Request) { 
  const body = await req.json(); 
  
  const result = signinFormSchema.safeParse(body)
  if(!result.success) {
    console.error('Validation error:', result.error.errors);
    return NextResponse.json({error: result.error.errors}, {status: 400})
  }

  const {email, password} = result.data; 
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, 
      password
    })
  
    if (error) {
      console.error('Login error:', error);
      return NextResponse.json({error: error.message}, {status: 400})
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return NextResponse.json({error: 'An unexpected error occurred'}, {status: 500})
  }
}