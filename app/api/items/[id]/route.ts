import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            return NextResponse.json(
                {error: error.message},
                {status: 500}
            )
        }
        if(!data) {
            return NextResponse.json(
                {error: 'Item not found'},
                {status: 404}
            )
        }
        //console.log(data);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        )
    }
}