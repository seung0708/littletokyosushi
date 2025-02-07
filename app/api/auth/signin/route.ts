import { signinFormSchema } from '@/schema-validations/auth';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) { 
  const body = await req.json(); 
  
  const result = signinFormSchema.safeParse(body)
  if(!result.success) {
    console.error('Validation error:', result.error.errors);
    return NextResponse.json({error: result.error.errors}, {status: 400})
  }

  const {email, password} = result.data; 
  const supabase = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  )
  const serverSupabase = await createServerClient();

  try {
    const { data: {users}, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    const existingUser = users.find(user => user.email === email && !user.is_anonymous);
    
    if (!existingUser) {
      console.log('existingUser', existingUser);
      return NextResponse.json({error: 'No account found with this email. Please sign up first.'})
    }

    const { data, error: signInError } = await serverSupabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (signInError) {
      console.error('Login error:', signInError);
      return NextResponse.json({error: signInError.message}, {status: 400})
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error during login:', error);
    return NextResponse.json({error: 'An unexpected error occurred'}, {status: 500})
  }
}