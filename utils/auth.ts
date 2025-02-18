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

        // Get employee record
        const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('id')
            .eq('id', user.id)
            .single();

        if (employeeError || !employeeData) {
            console.error('No employee record found:', { error: employeeError, userId: user.id });
            return { error: 'Unauthorized', status: 401 };
        }

        // Check admin role using employee ID
        const { data: roleData, error: roleError } = await supabase
            .from('employee_roles')
            .select('roles (name)')
            .eq('employee_id', employeeData.id);

        const hasAdminRole = roleData?.some(
            (er: any) => er.roles?.name === 'admin'
        );

        if (roleError || !hasAdminRole) {
            console.error('Role check failed:', { error: roleError, hasAdminRole, employeeId: employeeData.id });
            return { error: 'Unauthorized', status: 401 };
        }

        return { employeeData, user };
    } catch (error) {
        console.error('Auth check error:', error);
        return { error: 'Internal server error', status: 500 };
    }
}

export function transformItem(item: any) {
    return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category_id: item.category_id,
        is_available: item.is_available,
        special_instructions: item.special_instructions || '',
        image_urls: item.image_urls || [],
        category_name: item.categories?.name || '',
        quantity_in_stock: 0,
        low_stock_threshold: 0,
        sync_status: false
    };
}
