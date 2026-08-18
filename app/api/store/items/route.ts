import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
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
        
        
        if (error) throw error;

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu data' }, 
            { status: 500 }
        );
    }
}