import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const category = searchParams.get('category')
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select(`
                *,
                categories (
                    id,
                    name
                )
            `)
            .eq('category', category)
        
        
        if (error) throw error;

        if (!category) {
            return NextResponse.json(data);
        }

        
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu data' }, 
            { status: 500 }
        );
    }
}
