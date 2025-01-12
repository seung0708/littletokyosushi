import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { checkAdminAuth } from '../../../../utils/auth';
import { revalidatePath } from 'next/cache';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
    const { pathname } = new URL(request.url);
    const isAdminRequest = pathname.startsWith('/api/items/');

    try {
        if (isAdminRequest) {
            const authResult = await checkAdminAuth();
            if ('error' in authResult) {
                return NextResponse.json({ error: authResult.error }, { status: authResult.status });
            }
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
                )${isAdminRequest ? `,
                inventories (
                    quantity_in_stock,
                    low_stock_threshold,
                    sync_status
                )` : ''}
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
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ item });
    } catch (error) {
        console.error('Unexpected error in GET /api/items/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}


export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();

    try {
        const authResult = await checkAdminAuth();
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const body = await request.json();
        const id = parseInt(params.id);

        const { error: updateError } = await supabase
            .from('menu_items')
            .update(body)
            .eq('id', id);

        if (updateError) {
            console.error('Failed to update item:', updateError);
            return NextResponse.json(
                { error: 'Failed to update item' },
                { status: 500 }
            );
        }

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
