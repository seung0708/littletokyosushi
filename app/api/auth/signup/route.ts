import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { type NextRequest, NextResponse } from 'next/server'

// app/api/auth/signup/route.ts
export async function POST(req: NextRequest) {
  const supabase = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const serverSupabase = await createServerClient();

  try {
    const body = await req.json(); 
    const { email, password } = body;

    // Check if this is an anonymous user trying to convert
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json({ error: usersError.message }, { status: 400 });
    }

    const anonymousUser = users.find(user => user.is_anonymous === true && user.user_metadata.email === email);
    const existingUser = users.find(user => user.email === email && user.is_anonymous === false);
  
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists. Please sign in instead.' });
    }
    
    if (anonymousUser) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        anonymousUser.id,
        {
          email,
          password,
          email_confirm: true,
          user_metadata: {
            email: '',
            
          }
        }
      )

      if (updateError) {
        console.error('Update error:', updateError);
      }

    }
    if (!anonymousUser) {
      console.log('Anonymous user not found');
      
      const { data: { user }, error: authError } = await serverSupabase.auth.signUp({
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
  
      await supabase
        .from('customers')
        .insert({
          id: user.id,
          email: user.email,
        })
        .select()
        .single();      
    }

    const { data, error: signInError } = await serverSupabase.auth.signInWithPassword({
      email,
      password
    })

    if (signInError) {
      console.error('Sign-in error:', signInError);
      return NextResponse.json({ error: signInError.message }, { status: 400 });
    }

    return NextResponse.json(data);
   
  } catch (error) {
    console.error('Unexpected error during signup:', error);
    return NextResponse.json({error: 'An unexpected error occurred'}, {status: 500})
  }
}