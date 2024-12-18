import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    
    if (code) {
        const supabase = await createClient();
        
        // Exchange code for session
        await supabase.auth.exchangeCodeForSession(code);

        // Redirect to the home page or dashboard
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Handle error case
    return NextResponse.redirect(new URL('/auth/error', request.url));
}
