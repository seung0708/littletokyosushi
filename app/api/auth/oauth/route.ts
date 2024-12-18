import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabase = await createClient();
    try {

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${request.headers.get('origin')}/api/auth/callback`,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });
        console.log(data, error);
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
