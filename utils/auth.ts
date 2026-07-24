import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function checkAdminAuth() {
    const supabase = await createClient();
    
    try {
        // Check authentication first
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { error: 'Unauthorized', status: 401 };
        }

        // Get admin profile
        const { data: adminProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('auth_id', user.id)
            .eq('role', 'admin')
            .single();

        if (profileError || !adminProfile) {
            console.error('No admin profile found:', { error: profileError, userId: user.id });
            return { error: 'Unauthorized', status: 401 };
        }

        return { adminProfile, user };
    } catch (error) {
        console.error('Auth check error:', error);
        return { error: 'Internal server error', status: 500 };
    }
}

