import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// app/api/auth/oauth/route.ts
export async function POST(request: Request) {
    const supabase = await createClient();
    try {
        const origin = request.headers.get('origin');
        const redirectUrl = `${origin}/api/auth/callback`;

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'select_account',
                },
            },
        });
                
        if (error) {
            console.error('OAuth error:', error);
            throw error;
        }

        if (data.url) {
            console.log('Redirecting to:', data.url); // Debug log
            return NextResponse.redirect(data.url);
        }

        return NextResponse.json({ error: 'No URL returned' }, { status: 400 });

    } catch (error) {
        console.error('Error in OAuth:', error);
        return NextResponse.json(
            { error: 'Failed to authenticate with provider' },
            { status: 500 }
        );
    }
}