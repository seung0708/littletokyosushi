import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// app/api/auth/oauth/route.ts
export async function POST(request: Request) {
    const supabase = await createClient();
    try {
        const origin = request.headers.get('origin');
        const redirectUrl = `${origin}/checkout`;

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
            },
        });
                
        if (error) {
            console.error('OAuth error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (data.url) {
            return NextResponse.redirect(data.url);
        }

        return NextResponse.json({ error: 'No redirect URL returned' }, { status: 400 });
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
}