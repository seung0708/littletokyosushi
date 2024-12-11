import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  try {
    // Check authentication first
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Auth check - User:', user?.email);
    
    if (!user) {
      console.log('No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get employee record
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select('id')
      .eq('id', user.id)
      .single();

    if (employeeError || !employeeData) {
      console.log('No employee record found:', employeeError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role using employee ID
    const { data: roleData, error: roleError } = await supabase
      .from('employees')
      .select(`
        employee_roles (
          roles (
            name
          )
        )
      `)
      .eq('id', employeeData.id)
      .single();

    const hasAdminRole = roleData?.employee_roles?.some(
      (er: any) => er.roles?.name === 'admin'
    );

    if (roleError || !hasAdminRole) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Update menu item
    const { error: menuItemError } = await supabase
      .from('menu_items')
      .update({
        name: body.name,
        description: body.description,
        price: body.price,
        is_available: body.is_available,
        special_instructions: body.special_instructions,
      })
      .eq('id', params.id);

    if (menuItemError) throw menuItemError;

    revalidatePath('/admin/items');
    return NextResponse.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error in PATCH handler:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();

    try {
        // Check authentication first
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.log('No user found in request');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get employee record
        const { data: employeeData, error: employeeError } = await supabase
            .from('employees')
            .select('id')
            .eq('auth_id', user.id)
            .single();

        if (employeeError || !employeeData) {
            console.error('No employee record found:', { error: employeeError, userId: user.id });
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch the menu item
        const id = parseInt(params.id);
        const { data: item, error: itemError } = await supabase
            .from('menu_items')
            .select(`
                *,
                categories (
                    id,
                    name
                ),
                inventories (
                    quantity_in_stock,
                    low_stock_threshold,
                    sync_status
                )
            `)
            .eq('id', id)
            .single();

        if (itemError) {
            console.error('Failed to fetch item:', { error: itemError, itemId: id });
            return NextResponse.json(
                { error: 'Failed to fetch item' },
                { status: 500 }
            );
        }

        if (!item) {
            console.log('Item not found:', { itemId: id });
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(item);
    } catch (error) {
        console.error('Unexpected error in GET /api/items/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
