import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { APIError } from "@/lib/utils/api-error";

export async function GET() {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
        .from('categories')
        .select('*')
        if (error) {
            throw new APIError('Failed to fetch categories', 500);
        }
        
        if (!data || data.length === 0) {
            return NextResponse.json([]);
        }
        
        return NextResponse.json(data);

    } catch (error) {
        if (error instanceof APIError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            );
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred while fetching categories' },
            { status: 500 }
        );
    }
}
