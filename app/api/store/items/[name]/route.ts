import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { APIError } from "@/lib/utils/api-error";
import { Database } from "@/types/database.types";

type ModifierOption = Database['public']['Tables']['modifier_options']['Row'];
type ModifierWithOptions = Database['public']['Tables']['modifier_groups']['Row'] & {
    modifier_options: Database['public']['Tables']['modifier_options']['Row'][]
};

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    console.log('API Route - Fetching item with ID:', name);
    
    const supabase = await createClient();
    console.log('API Route - Supabase client created');

    try {
        console.log('API Route - Executing query for ID:', name);
        const { data: itemWithModifiers, error: itemError } = await supabase
        .from('menu_items')
        .select(`
            *,
            categories(*),
            modifier_groups(
                *,
                modifier_options(*)
            )
        `)
        .eq('name', name)
        .single();
        console.log('API Route - Fetched item:', itemWithModifiers);
        if (itemError) {
            console.error('Database error fetching item:', itemError);
            throw new APIError('Failed to fetch item details', 500);
        }

        if (!itemWithModifiers) {
            console.log('API Route - No item found for ID:', name);
            throw new APIError('Item not found', 404);
        }

        console.log('API Route - Successfully fetched item:', itemWithModifiers.id);

        // Format prices as numbers
        const formattedItem = {
            ...itemWithModifiers,
            price: parseFloat(itemWithModifiers.price),
            modifiers: itemWithModifiers.modifiers?.map((modifier: ModifierWithOptions) => ({
                ...modifier,
                modifier_options: (modifier.modifier_options ?? []).map((option: ModifierOption) => ({
                    ...option,
                    price: option.price
                }))
            })) ?? []
        };
        console.log('API Route - Formatted item:', formattedItem);
        return NextResponse.json(formattedItem);

    } catch (error) {
        console.error('Error fetching menu item:', error);
        
        if (error instanceof APIError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred while fetching the item' },
            { status: 500 }
        );
   }
}
