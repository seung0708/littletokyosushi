import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
        .from('categories')
        .select('*')
        console.log(data, error);
        if (error) throw new Error(error.message);
        
        return NextResponse.json(data);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch menu data' }, { status: 500 });
    }
}