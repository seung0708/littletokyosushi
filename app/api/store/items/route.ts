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
            .order('category_name', { ascending: true });
        if (error) throw error;
        
        // // Group items by category
        // const groupedData = data.reduce((acc: Record<string, any[]>, item) => {
        //     const categoryId = item.category_id;
        //     const categoryName = item.categories?.name || 'Uncategorized';
            
        //     if (!acc[categoryId]) {
        //         acc[categoryId] = [];
        //     }
        //     acc[categoryId].push(item);
        //     return acc;
        // }, {});

        return NextResponse.json(data);

    } catch (error) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch menu data' }, 
            { status: 500 }
        );
    }
}