import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { APIError } from "@/lib/utils/api-error";
import { Database } from "@/types/database.types";

type Modifier = Database['public']['Tables']['modifiers']['Row'];
type ModifierOption = Database['public']['Tables']['modifier_options']['Row'];
type ModifierWithOptions = Database['public']['Tables']['modifiers']['Row'] & {
    modifier_options: Database['public']['Tables']['modifier_options']['Row'][]
};

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const supabase = await createClient();

    try {

        // Fetch the menu item with all related data
        const { data: itemWithModifiers, error: itemError } = await supabase
            .from('menu_items')
            .select(`
                *,
                categories(*),
                modifiers(
                    *,
                    modifier_options(*)
                )
            `)
            .eq('id', id)
            .single();

        if (itemError) {
            console.error('Database error fetching item:', itemError);
            throw new APIError('Failed to fetch item details', 500);
        }

        if (!itemWithModifiers) {
            throw new APIError('Item not found', 404);
        }

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
