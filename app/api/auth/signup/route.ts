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
      password
    });
    console.log(user, authError);
    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
    }

    // Then create the customer record
    const { error: customerError } = await supabase
      .from('customers')
      .insert([
        { 
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    if (customerError) {
      // If customer creation fails, we should ideally delete the auth user
      // but Supabase doesn't provide a way to delete auth users via API
      console.error('Customer creation error:', customerError);
      return NextResponse.json({ error: customerError.message }, { status: 400 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return NextResponse.json({error: 'An unexpected error occurred'}, {status: 500})
  }
}