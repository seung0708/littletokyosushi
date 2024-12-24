import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  try {
    const body = await req.json(); 
    const { email, password } = body;

    // First create the auth user
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: {
          role: 'customer'
        }
      }
    });
    console.log(user, authError);
    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return NextResponse.json({error: 'An unexpected error occurred'}, {status: 500})
  }
}