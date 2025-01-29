import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // If an ID is provided, redirect to the [id] route
    if (id) {
        return NextResponse.redirect(new URL(`/api/main/items/${id}`, request.url));
    }

    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*, categories(*)')
            .order('category_id', { ascending: true })
            
        if (error) throw new Error(error.message);
        
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json({ error: 'Failed to fetch menu data' }, { status: 500 });
    }
}