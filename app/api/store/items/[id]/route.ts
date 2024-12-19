import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();

    try {
        // Fetch the menu item
        const id = parseInt(params.id);
        const { data: item, error: itemError } = await supabase
            .from('menu_items')
            .select(`
                *,
                categories (
                    id,
                    name
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

        // Transform the item to match the frontend expectations
        const transformedItem = {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            category_id: item.category_id,
            is_available: item.is_available,
            special_instructions: item.special_instructions || '',
            image_urls: item.image_urls || [],
            category_name: item.categories?.name || ''
        };

        return NextResponse.json({ item: transformedItem });
    } catch (error) {
        console.error('Unexpected error in GET /api/main/items/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}