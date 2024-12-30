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
        const { data: itemWithModifiers, error: itemError } = await supabase
            .from('menu_items')
            .select('*, modifiers(*, modifier_options(*))')
            .eq('id', id)
            .single();

        console.log('itemWithModifiers:', itemWithModifiers);
        if (itemError) {
            console.error('Failed to fetch item:', { error: itemError, itemId: id });
            return NextResponse.json(
                { error: 'Failed to fetch item' },
                { status: 500 }
            );
        }

        if (!itemWithModifiers) {
            console.log('Item not found:', { itemId: id });
            return NextResponse.json(
                { error: 'Item not found' },
                { status: 404 }
            );
        }

        const item = {
            id: itemWithModifiers.id,
            name: itemWithModifiers.name,
            description: itemWithModifiers.description,
            price: itemWithModifiers.price,
            image_urls: itemWithModifiers.image_urls,
            modifiers: itemWithModifiers.modifiers.map((mod: any) => ({
                id: mod.id,
                name: mod.name,
                min_selections: mod.min_selections,
                max_selections: mod.max_selections,
                is_required: mod.is_required,
                modifier_options: mod.modifier_options.map((opt: any) => ({
                    id: opt.id,
                    modifier_id: opt.modifier_id,
                    modifier_option_id: opt.id,
                    name: opt.name,
                    price: opt.price
                }))
            }))
        }
        return NextResponse.json(item);
    } catch (error) {
        console.error('Unexpected error in GET /api/main/items/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}