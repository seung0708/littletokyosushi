import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = await createClient();

    try {
        const { provider } = await request.json();

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${request.headers.get('origin')}/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in OAuth:', error);
        return NextResponse.json(
            { error: 'Failed to authenticate with provider' },
            { status: 500 }
        );
    }
}
