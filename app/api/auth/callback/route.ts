// app/api/auth/callback/route.ts
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const serverSupabase = createServerClient();
  
  try {
    // Get the OAuth code from the URL
    const requestUrl = new URL(request.url);
    console.log('requestUrl', requestUrl);
    const code = requestUrl.searchParams.get('code');
    
    if (!code) {
      throw new Error('No code provided');
    }

    // Exchange code for session
    const { data: { session }, error: exchangeError } = 
      await serverSupabase.auth.exchangeCodeForSession(code);

  
    if (exchangeError) throw exchangeError;

    if (!session?.user?.email) {
      throw new Error('No user email found');
    }
    console.log('session.user', session.user);
    
    // Check for existing anonymous user with this email
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    const anonymousUser = users.find(user => 
      user.is_anonymous === true && 
      (user.email === session.user.email || user.user_metadata.email === session.user.email)
    );
    console.log('anonymousUser', anonymousUser);

    if (anonymousUser) {
      const { data: {user: updatedUser}, error: updateError } = await supabase.auth.admin.deleteUser(anonymousUser.id);
    } else { 
      const { error: customerError } = await supabase
        .from('customers')
        .insert({
          id: session.user.id,
          first_name: session.user.user_metadata.full_name.split(' ')[0],
          last_name: session.user.user_metadata.full_name.split(' ')[1],
          email: session.user.email,
        })
    }
    return NextResponse.redirect(new URL('/checkout', request.url));
  } catch (error) {
    console.error('Error in callback:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}